import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { useChatStore } from "@/stores/chat-store"
import { useEffect } from "react"

export default function TopPanel({name, usertag, avatar, chatID, setIsFriendInfoOpen}: {name: string, usertag: string, avatar: string, chatID: string, setIsFriendInfoOpen: Function}){
  const {userChats} = useChatStore()

  
  return(
    <div className={styles.topPanel}>
      <div>
        {avatar 
        ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> 
        : <></>}
        <span className={styles.displayedName} onClick={() => setIsFriendInfoOpen(true)}>{name}</span>
        <span className={styles.usertag} onClick={() => setIsFriendInfoOpen(true)}>{usertag}
          {userChats[chatID]?.isTyping 
          ? <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> 
          : <></>}
        </span>
      </div>
      <div>
        <Icon.Settings/>
      </div>
    </div>
  )
}