import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"

export default function TopPanel({name, usertag, avatar, isOpponentTyping}: any){
  return(
    <div className={styles.topPanel}>
      {avatar ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> : <></>}
      <span className={styles.displayedName}>{name}</span><span className={styles.usertag}>{usertag} {isOpponentTyping ? <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> : <></>}</span>
    </div>
  )
}