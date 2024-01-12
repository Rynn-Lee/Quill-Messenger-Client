import TopPanel from "@/components/chat/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"
import { useContext, useEffect, useRef, useState } from "react"
import { sendMessageAPI } from "@/api/message-api"
import { WarningContext } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import Input from "@/components/interface/Input"
import Icon from "@/assets/Icons"
import { tryCatch } from "@/utils/try-catch"
import { netRequestHandler } from "@/utils/net-request-handler"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client/debug"
import { useMessageStore } from "@/stores/messages-store"
import Messages from "@/components/chat/messages/messages"

export default function ChatBox() {
  const router = useRouter()
  const {activeChat}: any = useChatStore()
  const user = useAccountStore()
  const warning: any = useContext(WarningContext)
  const chatID: any = router.query.chatID
  const socket: Socket | any = useContext(SocketContext)
  const ref = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping]: any = useState(false);
  const [typingTimer, setTypingTimer]: any = useState(null);
  const {messagesHistory,  addMessage, setInputMessage}: any = useMessageStore()

  useEffect(()=>{
    if(!messagesHistory[chatID]?.messages?.length){return}
    ref.current?.scrollIntoView({behavior: "smooth", block: "end"})
  }, [messagesHistory[chatID]?.messages?.length])

  const sendNewMessage = async() => {
    if(!messagesHistory[chatID]?.inputMessage || !socket){return}
    tryCatch(async()=>{
      const sentMessage = await netRequestHandler(sendMessageAPI(chatID, user._id, messagesHistory[chatID]?.inputMessage), warning)
      socket.emit('newMessage', {message: sentMessage.data, recipientID: activeChat.friend._id})
      addMessage(sentMessage.data)
      setInputMessage({chatID, message: ""})
    })
  }

  const startTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    stopTyping()
    if(isTyping){return}
    setIsTyping(true);
    socket.emit('typing', {state: true, recipientID: activeChat.friend._id, chatID})
  };

  const stopTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', {state: false, recipientID: activeChat.friend._id, chatID})
    }, 1000));
  };

  useEffect(() => {
      return () => clearTimeout(typingTimer); // Clear the timeout if the component is unmounted
  }, [typingTimer]);

  return (
    <div className={styles.chatBox}>
      <TopPanel
        name={activeChat?.friend?.displayedName}
        usertag={activeChat?.friend?.usertag}
        avatar={activeChat?.friend?.avatar}
        chatID={chatID}/>

      <Messages
        messagesHistory={messagesHistory}
        chatID={chatID}
        activeChat={activeChat}
        user={user}
        refProp={ref}/>

      <div className={styles.inputMessages}>
        <Input
          value={messagesHistory[chatID]?.inputMessage || ""}
          onChange={(e)=>{setInputMessage({chatID, message: e.target.value});startTyping()}}
          onKeyDown={(e)=>{(e.key == "Enter" && sendNewMessage());}}
          fancy={{
            text: "Lolba",
            background: "#ffffff0f",
            backgroundHover: "#ffffff1f",
            position: "left"
          }}/>
        <button onClick={sendNewMessage}><Icon.SendArrow/></button>
      </div>
    </div>
  )
}
