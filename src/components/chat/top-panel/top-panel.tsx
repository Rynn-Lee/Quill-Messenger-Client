import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { useChatStore } from "@/stores/chat-store"
import { useEffect, useState } from "react"

export default function TopPanel({name, usertag, avatar, chatID, setIsFriendInfoOpen}: {name: string, usertag: string, avatar: string, chatID: string, setIsFriendInfoOpen: Function}){
  const chatStore = useChatStore()
  const [data, setData] = useState<any>()

  useEffect(()=>{
    console.log(chatStore.activeChat.friend)
    setData(chatStore.activeChat.friend)
  },[chatStore.activeChat])
  

  return(
    <div className={styles.topPanel}>
      <div>
        {avatar 
        ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> 
        : <></>}
        <span className={styles.displayedName} onClick={() => setIsFriendInfoOpen(true)}>{data?.displayedName}</span>
        <span className={styles.usertag} onClick={() => setIsFriendInfoOpen(true)}>{data?.usertag}
          {chatStore.userChats[chatID]?.isTyping 
          ? <span className={styles.typing}><Icon.AnimatedPen/> Печатает...</span> 
          : <></>}
        </span>
      </div>
    </div>
  )
}