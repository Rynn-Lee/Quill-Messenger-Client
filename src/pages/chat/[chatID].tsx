import TopPanel from "@/components/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { fetchMessages, sendTextMessage } from "@/api/chat-api"
import { WarningContext } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import Image from "next/image"
import Input from "@/components/interface/Input"
import Icon from "@/assets/Icons"
import { tryCatch } from "@/utils/try-catch"
import { netRequestHandler } from "@/utils/net-request-handler"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client/debug"

export default function ChatBox() {
  const router = useRouter()
  const {activeChat}: any = useChatStore()
  const user = useAccountStore()
  const warning: any = useContext(WarningContext)
  const [messagesHistory, setMessagesHistory]: any = useState([])
  const [messageToSend, setMessageToSend] = useState("")
  const ChatID: any = router.query.chatID
  const socket: Socket | any = useContext(SocketContext)
  const ref = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping]: any = useState(false);
  const [typingTimer, setTypingTimer]: any = useState(null);
  const [isOpponentTyping, setIsOpponentTyping]: any = useState(false);

  const retrieveMessages = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(fetchMessages(ChatID), warning)
      setMessagesHistory(result.data)
    })
  }

 // Will be obsolete in the future after implementing caching or retrieveng 20 msgs per request
  useEffect(()=>{
    if(!socket?.connected){return}
    retrieveMessages()
  }, [ChatID, socket?.connected])

  useEffect(()=>{
    if(!socket?.connected){return}
    socket.on('newMessage', (data: any) => {
      if(data.chatID != ChatID){ return }
      setMessagesHistory((prevState: any)=>([...prevState, {...data}]))
    })
    socket.on('typing', (data: any) => {
      if(data.ChatID != ChatID){ return }
      console.log("Typing event!", data)
      setIsOpponentTyping(data.state)
    })
    return () => {
      socket.off('newMessage')
      socket.off('typing')
    }
  }, [socket, ChatID])

  useEffect(()=>{ // smooth transition for new messages
    if(!messagesHistory?.length){return}
    ref.current?.scrollIntoView({behavior: "smooth", block: "end"})
  }, [messagesHistory?.length])

  const sendNewMessage = async() => {
    if(!messageToSend || !socket){return}
    console.log("SOCKET FROM CHATID", socket)
    tryCatch(async()=>{
      const sentMessage = await netRequestHandler(sendTextMessage(ChatID, user._id, messageToSend), warning)
      socket.emit('newMessage', {message: sentMessage.data, recipientID: activeChat.friend._id})
      setMessagesHistory([...messagesHistory, sentMessage.data])
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

  useEffect(()=>{
    console.log("IS OPPONENT TYPING", isOpponentTyping)
  }, [isOpponentTyping])

  useEffect(() => {
      return () => clearTimeout(typingTimer); // Clear the timeout if the component is unmounted
  }, [typingTimer]);

  return (
    <div className={styles.chatBox}>
      <TopPanel
        name={activeChat?.friend?.displayedName}
        usertag={activeChat?.friend?.usertag}
        avatar={activeChat?.friend?.avatar}
        isOpponentTyping={isOpponentTyping}/>

      <div className={styles.chatContent}>
        {messagesHistory?.map((message: any) => {
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
        {!messagesHistory?.length ? <span>The chat is empty!</span> : <></>}
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
