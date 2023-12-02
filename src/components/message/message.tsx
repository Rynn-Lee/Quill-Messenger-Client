import Image from 'next/image'
import styles from './message.module.sass'
import Icon from '@/assets/Icons'
import { useEffect, useState } from 'react'
import { fetchUserId } from '@/api/auth-api'
import { useRouter } from 'next/router'

export default function Message({chat, user}: any){
  const [userData, setUserData]: any = useState()
  const router = useRouter()
  const fetchData = async() => {
    const userID = chat.members[0] != user._id ? chat.members[0] : chat.members[1]
    const result = await fetchUserId(userID)
    setUserData(result.data)
  }

  useEffect(()=>{
    !userData && fetchData()
  }, [userData])

  return(
    <div className={`${styles.messageBlock} ${router.query.chatID == chat._id ? styles.activePage : ""}`}>
      <Image
        src={"https://avatars.githubusercontent.com/u/38906839?v=4"}
        alt="pfp" width={40} height={40}/>
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