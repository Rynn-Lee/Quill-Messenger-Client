import Image from 'next/image'
import styles from './dialog.module.sass'
import Icon from '@/assets/Icons'
import { useContext, useEffect, useState } from 'react'
import { fetchUserByIdAPI } from '@/api/user-api'
import { useRouter } from 'next/router'
import { useChatStore } from '@/stores/chat-store'
import { WarningContext } from '@/lib/warning/warning-context'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { useAccountStore } from '@/stores/account-store'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'

export default function Dialog({chat, chatStore}: any){
  const [opponentData, setOpponentData]: any = useState()
  const {setActiveChat, activeChat}: any = useChatStore()
  const socket: Socket | any = useContext(SocketContext)
  const user = useAccountStore()
  const warning: any = useContext(WarningContext)
  const router = useRouter()
  const [messageData, setMessageData] = useState({
    senderID: "",
    text: "",
    time: "",
  })
  
  const selectChat = () => setActiveChat({chat: chat, friend: opponentData})

  useEffect(()=>{
    if(opponentData || !socket?.connected){return}
    const userID = chat.members[0] != user._id ? chat.members[0] : chat.members[1]
    tryCatch(async()=>{
      const result = await netRequestHandler(fetchUserByIdAPI(userID), warning)
      setOpponentData(result.data)
    })
  }, [opponentData, socket?.connected])
  
  useEffect(()=>{
    if(!chatStore?.messages?.length){return}
    const timeDate = new Date(chatStore?.messages[chatStore?.messages.length-1].createdAt)
    setMessageData({
      senderID: chatStore?.messages[chatStore?.messages.length-1].senderID,
      text: chatStore?.messages[chatStore?.messages.length-1].text,
      time: `${timeDate.getHours()}:${timeDate.getMinutes() < 10 ? "0" + timeDate.getMinutes() : timeDate.getMinutes()}`
    })
  }, [chatStore])


  const Typing = () => <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> 
  const Draft = () => <><span className={styles.draft}>{"Draft: "}</span>{chatStore?.inputMessage}</>
  const Message = () => <><span className={styles.sentFromMe}>{messageData.senderID == user._id ? "You: " : ""}</span>
                          {messageData?.text?.length ? messageData.text : "No messages yet..."}</>

  return(
    <div className={`${styles.messageBlock} ${router.query.chatID == chat._id ? styles.activePage : ""}`} onClick={selectChat}>
      {opponentData?.avatar ? <Image src={opponentData?.avatar} alt="pfp" width={40} height={40}/> : <></>}
      <div className={styles.messageContent}>
        <div className={styles.top}>
          <span className={styles.name}>{opponentData?.displayedName}</span>
          <span className={styles.time}>{messageData?.time?.length ? messageData.time : ""}</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.message}>
            {chatStore?.isTyping
            ? <Typing />
            : chatStore?.inputMessage.length && activeChat.chat._id != chat._id
              ? <Draft />
              : <Message />
            }
          </span>
          <span className={styles.status}>0</span>
        </div>
      </div>
    </div>
  )
}