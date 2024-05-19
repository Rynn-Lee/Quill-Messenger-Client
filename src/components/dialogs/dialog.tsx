import Image from 'next/image'
import styles from './dialog.module.sass'
import Icon from '@/assets/Icons'
import { useContext, useEffect, useState } from 'react'
import { fetchUserByIdAPI } from '@/api/user-api'
import { useRouter } from 'next/router'
import { WarningContext, warningHook } from '@/lib/warning/warning-context'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { useAccountStore } from '@/stores/account-store'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'
import { calculateDate } from '@/utils/calculate-date'
import { useChatStore, chat } from '@/stores/chat-store'
import { useCounterStore } from '@/stores/counter-store'

export default function Dialog({chat, messagesStore}: {chat: chat, messagesStore: any}){
  const [opponentData, setOpponentData] = useState<any>()
  const {setActiveChat, activeChat} = useChatStore()
  const counterStore = useCounterStore()
  const socket: Socket | any = useContext(SocketContext)
  const user = useAccountStore()
  const warning = useContext<warningHook>(WarningContext)
  const router = useRouter()
  const [messageData, setMessageData] = useState({
    senderID: "",
    text: "",
    time: "",
  })
  
  const selectChat = () => {
    console.log("SELECTING", chat._id)
    setActiveChat({chat: chat, friend: opponentData})
  }

  useEffect(()=>{
    if(opponentData || !socket?.connected || !chat?.members?.length){return}
    const userID = chat.members[0] != user._id ? chat.members[0] : chat.members[1]
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>fetchUserByIdAPI(userID), warning)
      setOpponentData(result.data)
    })
  }, [opponentData, socket?.connected])

  useEffect(()=>{
    if(!messagesStore?.messages?.length){return}
    setMessageData({
      senderID: messagesStore?.messages[messagesStore?.messages.length-1].senderID,
      text: messagesStore?.messages[messagesStore?.messages.length-1].text,
      time: `${calculateDate(messagesStore?.messages[messagesStore?.messages.length-1].createdAt, 'count')}`
    })
  }, [messagesStore])


  const Typing = () => <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> 
  const Draft = () => <><span className={styles.draft}>{"Draft: "}</span>{messagesStore?.inputMessage}</>
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
            {chat?.isTyping
            ? <Typing />
            : chat?.inputMessage?.length && activeChat.chat._id != chat._id
              ? <Draft />
              : <Message />
            }
          </span>
          {counterStore?.counters[chat._id]?.counter ? <span className={styles.messagesCounter}>{counterStore?.counters[chat._id]?.counter}</span> : null}
        </div>
      </div>
    </div>
  )
}