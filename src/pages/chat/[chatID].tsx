import TopPanel from "@/components/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { sendTextMessage } from "@/api/chat-api"
import { WarningContext } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import Image from "next/image"
import Input from "@/components/interface/Input"
import Icon from "@/assets/Icons"
import { tryCatch } from "@/utils/try-catch"
import { netRequestHandler } from "@/utils/net-request-handler"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client/debug"
import { useMessageStore } from "@/stores/messages-store"

export default function ChatBox() {
  const router = useRouter()
  const {activeChat}: any = useChatStore()
  const user = useAccountStore()
  const warning: any = useContext(WarningContext)
  const [messageToSend, setMessageToSend] = useState("")
  const ChatID: any = router.query.chatID
  const socket: Socket | any = useContext(SocketContext)
  const ref = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping]: any = useState(false);
  const [typingTimer, setTypingTimer]: any = useState(null);
  const {messagesHistory,  addMessage}: any = useMessageStore()

  useEffect(()=>{ // smooth transition for new messages
    if(!messagesHistory[ChatID]?.messages?.length){return}
    ref.current?.scrollIntoView({behavior: "smooth", block: "end"})
  }, [messagesHistory[ChatID]?.messages?.length])

  const sendNewMessage = async() => {
    if(!messageToSend || !socket){return}
    tryCatch(async()=>{
      const sentMessage = await netRequestHandler(sendTextMessage(ChatID, user._id, messageToSend), warning)
      socket.emit('newMessage', {message: sentMessage.data, recipientID: activeChat.friend._id})
      addMessage(sentMessage.data)
      setMessageToSend("")
    })
  }

  const startTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    stopTyping()
    if(isTyping){return}
    setIsTyping(true);
    socket.emit('typing', {state: true, recipientID: activeChat.friend._id, ChatID})
  };

  const stopTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', {state: false, recipientID: activeChat.friend._id, ChatID})
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
        ChatID={ChatID}/>

      <div className={styles.chatContent}>
        {messagesHistory[ChatID]?.messages?.map((message: any) => {
          const date = new Date(message.createdAt)
          return (
          <Fragment key={message._id}>
            <div id={message._id} className={`${styles.message} ${message.senderID == user._id ? styles.myMessage : styles.notMyMessage} ${styles.showAnim}`}>
              {activeChat?.friend?.avatar ? <Image
                src={message.senderID == user._id ? user.avatar : activeChat?.friend?.avatar}
                alt="avatar"
                width={30}
                height={30}/> : <></>}
              <div className={styles.text}>
                {message.text}<br/>
                <span className={styles.timeSent}>{`${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`}</span>
              </div>
            </div>
            <div ref={ref} />
          </Fragment>
        )})}
        {!messagesHistory[ChatID]?.messages?.length ? <span>The chat is empty!</span> : <></>}
      </div>

      <div className={styles.inputMessages}>
        <Input
          value={messageToSend}
          onChange={(e)=>{setMessageToSend(e.target.value);startTyping()}}
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
