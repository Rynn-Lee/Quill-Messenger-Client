import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { chat, useChatStore } from "@/stores/chat-store"

export default function TopPanel({name, usertag, avatar, chatID}: {name: string, usertag: string, avatar: string, chatID: string}){
  const {userChats} = useChatStore()
  return(
    <div className={styles.topPanel}>
      <div>
        {avatar 
        ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> 
        : <></>}
        <span className={styles.displayedName}>{name}</span>
        <span className={styles.usertag}>{usertag}
          {userChats[chatID]?.isTyping 
          ? <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> 
          : <></>}
        </span>
      </div>
      <div>
        <Icon.AudioCall/>
        <Icon.VideoCall/>
      </div>
    </div>
  )
}