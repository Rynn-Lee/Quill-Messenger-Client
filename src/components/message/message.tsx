import Image from 'next/image'
import styles from './message.module.sass'
import Icon from '@/assets/Icons'

export default function Message({avatar, displayedName, time, message}: any){
  return(
    <div className={styles.messageBlock}>
      <Image
        src={avatar}
        alt="pfp" width={40} height={40}/>
      <div className={styles.messageContent}>
        <div className={styles.top}>
          <span className={styles.name}>{displayedName}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.message}>{message}</span>
          <span className={styles.status}><Icon.DoubleCheck/></span>
        </div>
      </div>
    </div>
  )
}