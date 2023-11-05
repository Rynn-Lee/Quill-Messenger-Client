import styles from "./message.module.sass"
import Image from "next/image"

export default function Message({name}: any){
  return(
    <div className={styles.Message}>
      <Image src={"https://avatars.githubusercontent.com/u/38906839?v=4"} alt="pfp" width={40} height={40}/>
      <div className={styles.texts}>
        <div className={styles.upperLine}>
          <span className={styles.name}><b>{name}</b></span>
          <span className={styles.time}>12:55 PM</span>
        </div>
        <span className={styles.messagePreview}>There once was a ship that put to sea, the name of the ship was</span>
      </div>
    </div>
  )
}