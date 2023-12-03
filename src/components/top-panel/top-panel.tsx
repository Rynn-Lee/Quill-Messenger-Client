import Image from "next/image"
import styles from "./toppanel.module.sass"

export default function TopPanel({name, usertag, avatar}: any){
  return(
    <div className={styles.topPanel}>
      {avatar ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> : <></>}
      <span className={styles.displayedName}>{name}</span><span className={styles.usertag}>{usertag}</span>
    </div>
  )
}