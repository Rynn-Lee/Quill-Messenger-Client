import Image from 'next/image'
import styles from './message.module.sass'
import Icon from '@/assets/Icons'
import { useContext, useEffect, useState } from 'react'
import { fetchUserId } from '@/api/user-api'
import { useRouter } from 'next/router'
import { useChatStore } from '@/stores/chat-store'
import { WarningContext } from '@/lib/warning/warning-context'

export default function Message({chat, user}: any){
  const [userData, setUserData]: any = useState()
  const {setActiveChat}: any = useChatStore()
  const warning: any = useContext(WarningContext)
  const router = useRouter()
  
  const fetchData = async() => {
    const userID = chat.members[0] != user._id ? chat.members[0] : chat.members[1]
    const result = await fetchUserId(userID)
    if(result.status >= 400){
      warning.showWindow({title: "Couldn't fetch messages", message: result.message})
      return
    }
    setUserData(result.data)
  }

  const selectChat = () => {
    setActiveChat({chat: chat, friend: userData})
  }

  useEffect(()=>{
    !userData && fetchData()
  }, [userData])

  return(
    <div className={`${styles.messageBlock} ${router.query.chatID == chat._id ? styles.activePage : ""}`} onClick={selectChat}>
      {userData?.avatar ? <Image
        src={userData?.avatar}
        alt="pfp" width={40} height={40}/> : <></>}
      <div className={styles.messageContent}>
        <div className={styles.top}>
          <span className={styles.name}>{userData?.displayedName}</span>
          <span className={styles.time}>12:00 AM</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.message}>message</span>
          <span className={styles.status}><Icon.DoubleCheck/></span>
        </div>
      </div>
    </div>
  )
}