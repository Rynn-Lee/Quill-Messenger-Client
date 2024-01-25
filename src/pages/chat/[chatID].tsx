import TopPanel from "@/components/chat/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"
import React, { useContext, useEffect, useRef, useState } from "react"
import { sendMessageAPI } from "@/api/message-api"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import Input from "@/components/interface/Input"
import Icon from "@/assets/Icons"
import { tryCatch } from "@/utils/try-catch"
import { netRequestHandler } from "@/utils/net-request-handler"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client/debug"
import { useMessageStore } from "@/stores/messages-store"
import Messages from "@/components/chat/messages/messages"

const MemoMessages = React.memo(Messages)
const MemoTopPanel = React.memo(TopPanel)

export default function ChatBox() {
  const router = useRouter()
  const chatStore = useChatStore()
  const user = useAccountStore()
  const warning = useContext<warningHook>(WarningContext)
  const chatID: string = router.query.chatID as string
  const socket: Socket | any = useContext(SocketContext)
  const ref = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingTimer, setTypingTimer] = useState<any>(null);
  const {messagesHistory,  addMessage}: any = useMessageStore()

  useEffect(()=>{
    if(!messagesHistory[chatID]?.messages?.length){return}
    ref.current?.scrollIntoView({behavior: "smooth", block: "end"})
  }, [messagesHistory[chatID]?.messages?.length])

  const sendNewMessage = async() => {
    if(!chatStore.userChats[chatID]?.inputMessage || !socket){return}
    tryCatch(async()=>{
      const sentMessage = await netRequestHandler(()=>sendMessageAPI(chatID, user._id, chatStore.userChats[chatID]?.inputMessage), warning)
      socket.emit('newMessage', {message: sentMessage.data, recipientID: chatStore.activeChat.friend._id})
      addMessage(sentMessage.data)
      chatStore.setInputMessage({chatID, message: ""})
      chatStore.setChatMessageTime({chatID, time: sentMessage.data.createdAt})
    })
  }
  const startTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    stopTyping()
    if(isTyping){return}
    setIsTyping(true);
    socket.emit('typing', {state: true, recipientID: chatStore.activeChat.friend._id, chatID})
  };

  const stopTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', {state: false, recipientID: chatStore.activeChat.friend._id, chatID})
    }, 1000));
  };

  useEffect(() => {
      return () => clearTimeout(typingTimer); // Clear the timeout if the component is unmounted
  }, [typingTimer]);

  return (
    <div className={styles.chatBox}>
      <MemoTopPanel
        name={chatStore.activeChat?.friend?.displayedName}
        usertag={chatStore.activeChat?.friend?.usertag}
        avatar={chatStore.activeChat?.friend?.avatar}
        chatID={chatID}/>

      <MemoMessages
        messagesHistory={messagesHistory}
        chatID={chatID}
        activeChat={chatStore.activeChat}
        user={user}
        refProp={ref}/>

      <div className={styles.inputMessages}>
      <Input
          value={chatStore.userChats[chatID]?.inputMessage || ""}
          onChange={(e)=>{chatStore.setInputMessage({chatID, message: e.target.value});startTyping()}}
          onKeyDown={(e)=>{(e.key == "Enter" && sendNewMessage());}}
          fancy={{text: "Message", backgroundHover: "var(--messageInput)", background: "var(--messageInput)", position: "left"}}
          type="text"/>
        <button onClick={sendNewMessage}><Icon.SendArrow/></button>
      </div>
    </div>
  )
}
