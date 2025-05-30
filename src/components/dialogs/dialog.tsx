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
import { useChatStore, chat, friend } from '@/stores/chat-store'
import { useCounterStore } from '@/stores/counter-store'
import { decodeImage } from '@/utils/decodeImage'
import { useMessageStore } from '@/stores/messages-store'
import { useUserCache } from '@/stores/user-cache'



export default function Dialog({chat, messagesStore, chooseDeleteId, deleteId, deleteChat}: {chat: any, messagesStore: any, chooseDeleteId: Function, deleteId: string, deleteChat: Function}) {
  const [opponentData, setOpponentData] = useState<any>()
  const {setActiveChat, activeChat} = useChatStore()
  const chatStore = useChatStore()
  const counterStore = useCounterStore()
  const socket: Socket | any = useContext(SocketContext)
  const REALmessageStore = useMessageStore()
  const user = useAccountStore()
  const userCache = useUserCache()
  const warning = useContext<warningHook>(WarningContext)
  const router = useRouter()
  const [messageData, setMessageData] = useState({
    senderID: "",
    text: "",
    type: "",
    image: "",
    time: "",
  })

  const selectChat = () => {
    if(activeChat?.chat?._id == chat?._id){return}
    chooseDeleteId('')
    setActiveChat({chat: chat, friend: opponentData!})
    counterStore.resetCounter({chatID: chat._id})
  
  }

  useEffect(()=>{
    setDialogData()
  }, [opponentData, socket?.connected])
  
  useEffect(()=>{
    setDialogData(true)
  },[user.trigger])

  const setDialogData = async (ignoreAll: boolean = false) => {
    if((opponentData || !socket?.connected || !chat?.members?.length) && !ignoreAll){return}
    console.log("PASS")
    if(chat?.members?.length > 2){
      setOpponentData({
        avatar: decodeImage(chat?.image?.code) || "",
        displayedName: chat.name,
        usertag: `${chat.members.length} участников`,
        type: 'group'
      })
      return
    }
    const userID = chat?.members[0] != user._id ? chat.members[0] : chat.members[1]
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>fetchUserByIdAPI(userID), warning)
      const decodedURL: any = decodeImage(result.data.avatar.code);
      setOpponentData({...result.data, avatar: decodedURL})
    })
  }

  useEffect(()=>{
    if(!messagesStore?.messages?.length){return}
    setMessageData({
      senderID: messagesStore?.messages[messagesStore?.messages.length-1].senderID,
      text: messagesStore?.messages[messagesStore?.messages.length-1].text?.text,
      image: messagesStore?.messages[messagesStore?.messages.length-1].text?.code ?? "",
      type: messagesStore?.messages[messagesStore?.messages.length-1].type,
      time: `${calculateDate(messagesStore?.messages[messagesStore?.messages.length-1].createdAt, 'count')}`
    })
  }, [messagesStore])


  const Typing = () => <span className={styles.typing}><Icon.AnimatedPen/> Пишет...</span> 
  const Draft = () => <><span className={styles.draft}>{"Черновик: "}</span>{chatStore.userChats[chat._id]?.inputMessage}</>
  const Message = () => <>
                          <span className={styles.sentFromMe}>{
                            !REALmessageStore?.messagesHistory[chat._id]?.messages?.length 
                            ? "" 
                            : messageData.senderID == user._id
                              ? "Вы: "
                              : opponentData?.type == 'group'
                                ?`${userCache?.userCache[messageData.senderID]?.displayedName ?? 'user'}: `
                                : ""
                          }
                          </span>
                          {!REALmessageStore?.messagesHistory[chat._id]?.messages?.length
                          ? "Пока нет сообщений..."
                          : messageData.type == 'media'
                            ? <span className={styles.sentFromMe}><Image src={messageData.image} width={15} height={15} style={{borderRadius: 7}} alt=""/> [image]</span>
                            :  messageData.type == 'media-text'
                              ? <><Image src={messageData.image} width={15} height={15} style={{borderRadius: 7}} alt=""/> {messageData.text}</>
                              : messageData.text
                          }
                        </>


  return(
    <div className={`${styles.messageBlock} ${router.query.chatID == chat._id ? styles.activePage : ""}`} onClick={selectChat} onContextMenu={(e)=>{e.preventDefault(); chooseDeleteId(chat._id);}}>
      <div className={`${styles.deleteBlock} + ${deleteId == chat._id ? styles.deleteBlockActive : ""}`}>
        <div onClick={()=>{deleteChat(chat, opponentData)}}><Icon.Remove width='25' height='25' color='#fff'/></div>
      </div>
      {opponentData?.avatar ? 
      <div className={styles.avatarBlock}>
        <Image src={opponentData?.avatar ?? ""} alt="pfp" width={40} height={40}/>
      </div>
      : <></>}
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
          {counterStore?.counters[chat._id]?.counter ? <span className={styles.messagesCounter}>{counterStore.counters[chat._id].counter}</span> : null}
        </div>
      </div>
    </div>
  )
}