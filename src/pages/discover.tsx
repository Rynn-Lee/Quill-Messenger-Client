import { fetchRandomUserAPI, fetchUserByTagAPI } from "@/api/user-api"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { userData } from "@/types/types"
import styles from '@/styles/pages/discover.module.sass'
import { netRequestHandler } from "@/utils/net-request-handler"
import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Icon from "@/assets/Icons"
import { calculateDate } from "@/utils/calculate-date"
import { useRouter } from "next/router"
import { tryCatch } from "@/utils/try-catch"
import { useChatStore } from "@/stores/chat-store"
import { createNewChatAPI } from "@/api/chat-api"
import { useAccountStore } from "@/stores/account-store"
import { decodeImage } from "@/utils/decodeImage"


export default function Discover() {
  const [randomUser, setRandomUser] = useState<any>()
  const router = useRouter()
  const account = useAccountStore()
  const warning = useContext<warningHook>(WarningContext)
  const chatStore = useChatStore()

  useEffect(()=>{
    !randomUser && fetchRandomUser()
  }, [])
  
  const fetchRandomUser = async() => {
    const result = await netRequestHandler(() => fetchRandomUserAPI(account._id), warning)
    setRandomUser({
      ...result.data,
      avatar: decodeImage(result?.data?.avatar?.code)
    })
  }

  const createNewChat = async() => {
    tryCatch(async()=>{
      if(!randomUser){return}
      const doesChatExist = Object.keys(chatStore.userChats).filter((chat: any) => {
        if(chatStore.userChats[chat].members[0] == randomUser._id || chatStore.userChats[chat].members[0] == randomUser._id){
          console.log("CHAT EXITS")
          chatStore.setActiveChat({chat: chat, friend: randomUser})
          router.push(`/chat/${chatStore.userChats[chat]._id}`)
          return true
        }
      })
      if(doesChatExist.length){return}
      const newChat = await netRequestHandler(()=>createNewChatAPI(account._id, randomUser._id), warning)
      chatStore.addNewChat(newChat.data)
      chatStore.setActiveChat({chat: newChat.data, friend: randomUser})
      router.push(`/chat/${newChat.data._id}`)
    })
  }

  return (
    <div className={styles.page}>
      <span className={styles.title}>✨ Найдите новых друзей для общения!</span>
      <div className={styles.users}>
        <div className={styles.randomDiv}>
          {randomUser?._id && (
            <div className={styles.userInfo}>
              <div className={styles.pfpblock}>
                <Image src={randomUser.avatar} width={140} height={140} alt="avatar"/>
              </div>
              <div className={styles.infoblock}>
                <div>
                  <span className={styles.row + " " + styles.username}>{randomUser.displayedName}</span>
                  <span className={styles.row}><Icon.User/> {randomUser.usertag}</span>
                  <span className={styles.row}><Icon.Calendar color="#fff" width="26px" height="20px"/> {calculateDate(randomUser.createdAt.toString(), 'full')}</span>
                  <div style={{flexDirection: "row", display: "flex"}}>
                    <button onClick={()=>createNewChat(randomUser.usertag)} style={{flex: 2}}>Начать новую беседу!</button>
                    <button onClick={fetchRandomUser} style={{flex: 1}}>Попробовать снова</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!randomUser?._id  ? <button onClick={fetchRandomUser}>Получить собеседника!</button> : null}
        </div>
      </div>
    </div>
  )
}
