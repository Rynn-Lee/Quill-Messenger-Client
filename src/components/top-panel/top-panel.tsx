import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { useEffect, useState } from "react"
import { useSocketStore } from "@/stores/socket-store"

export default function TopPanel({name, usertag, avatar, ChatID}: any){
  const [isOpponentTyping, setIsOpponentTyping] = useState(false)
  const {socket}: any = useSocketStore()

  useEffect(()=>{
    if(!socket?.io){return}
    socket.io.on('typing', (data: any) => {
      if(data.ChatID != ChatID){ return }
      setIsOpponentTyping(data.state)
    })
    return () => {
      socket.io.off('typing')
    }
  }, [])


  return(
    <div className={styles.topPanel}>
      {avatar ? <Image src={avatar} alt="avatar" height={40} width={40} className={styles.avatar}/> : <></>}
      <span className={styles.displayedName}>{name}</span><span className={styles.usertag}>{usertag} {isOpponentTyping ? <span className={styles.typing}><Icon.AnimatedPen/> Typing...</span> : <></>}</span>
    </div>
  )
}