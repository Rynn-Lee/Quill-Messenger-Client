import Image from 'next/image'
import styles from './message.module.sass'
import Icon from '@/assets/Icons'
import { useContext, useEffect, useState } from 'react'
import { fetchUserId } from '@/api/user-api'
import { useRouter } from 'next/router'
import { useChatStore } from '@/stores/chat-store'
import { WarningContext } from '@/lib/warning/warning-context'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { useAccountStore } from '@/stores/account-store'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'
import { useMessageStore } from '@/stores/messages-store'

export default function Message({chat}: any){
  const [OpponentData, setOpponentData]: any = useState()
  const {setActiveChat}: any = useChatStore()
  const {messagesHistory}: any = useMessageStore()
  const socket: Socket | any = useContext(SocketContext)
  const user = useAccountStore()
  const warning: any = useContext(WarningContext)
  const router = useRouter()
  const [messageData, setMessageData] = useState({
    senderID: "",
    text: "",
    time: "",
  })
  
  const selectChat = () => setActiveChat({chat: chat, friend: OpponentData})

  const fetchData = async() => {
    if(!socket?.connected){return}
    const userID = chat.members[0] != user._id ? chat.members[0] : chat.members[1]
    tryCatch(async()=>{
      const result = await netRequestHandler(fetchUserId(userID), warning)
      setOpponentData(result.data)
    })
  }

  useEffect(()=>{
    if(!messagesHistory[chat._id]?.length){return}
    const timeDate = new Date(messagesHistory[chat._id][messagesHistory[chat._id].length-1].createdAt)
    setMessageData({
      senderID: messagesHistory[chat._id][messagesHistory[chat._id].length-1].senderID,
      text: messagesHistory[chat._id][messagesHistory[chat._id].length-1].text,
      time: `${timeDate.getHours()}:${timeDate.getMinutes() < 10 ? "0" + timeDate.getMinutes() : timeDate.getMinutes()}`
    })
  }, [messagesHistory[chat._id]])

  useEffect(()=>{
    !OpponentData && fetchData()
  }, [OpponentData, socket?.connected])

  return(
    <div className={`${styles.messageBlock} ${router.query.chatID == chat._id ? styles.activePage : ""}`} onClick={selectChat}>
      {OpponentData?.avatar ? <Image
        src={OpponentData?.avatar}
        alt="pfp" width={40} height={40}/> : <></>}
      <div className={styles.messageContent}>
        <div className={styles.top}>
          <span className={styles.name}>{OpponentData?.displayedName}</span>
          <span className={styles.time}>{messageData?.time?.length ? messageData.time : ""}</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.message}><span className={styles.sentFromMe}>{messageData.senderID == user._id ? "You: " : ""}</span>{messageData?.text?.length ? messageData.text : "No messages yet..."}</span>
          <span className={styles.status}><Icon.DoubleCheck/></span>
        </div>
      </div>
    </div>
  )
}