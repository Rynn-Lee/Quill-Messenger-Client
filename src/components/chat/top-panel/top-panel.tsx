import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { useMessageStore } from "@/stores/messages-store"

export default function TopPanel({name, usertag, avatar, chatID}: {name: string, usertag: string, avatar: string, chatID: string}){
  const {messagesHistory} = useMessageStore()
  return(
    <div className={styles.topPanel}>
      {avatar 
      ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> 
      : <></>}
      <span className={styles.displayedName}>{name}</span>
      <span className={styles.usertag}>{usertag}
        {messagesHistory[chatID]?.isTyping 
        ? <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> 
        : <></>}
      </span>
    </div>
  )
}