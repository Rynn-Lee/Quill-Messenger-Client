import Image from "next/image"
import styles from "./toppanel.module.sass"
import Icon from "@/assets/Icons"
import { useChatStore } from "@/stores/chat-store"
import { useEffect, useState } from "react"

export default function TopPanel({name, usertag, avatar, chatID, setIsFriendInfoOpen}: {name: string, usertag: string, avatar: string, chatID: string, setIsFriendInfoOpen: Function}){
  const chatStore = useChatStore()
  const [data, setData] = useState<any>()

  useEffect(()=>{
    console.log("CHANTANGANTGANGANGANGANAN", chatStore.activeChat.friend.type)
    chatStore.activeChat.friend.type
    ? setData({
        name: chatStore.activeChat?.friend?.displayedName,
        usertag: chatStore.activeChat?.friend?.usertag,
        avatar: chatStore.activeChat?.friend?.avatar,
        chatID, setIsFriendInfoOpen
      }) 
    : setData({
      name, usertag, avatar, chatID, setIsFriendInfoOpen
    })
  }, [chatStore.userChats[chatID]])

  return(
    <div className={styles.topPanel}>
      <div>
        {data?.avatar
        ? <Image src={data.avatar ?? ""} alt="avatar" height={40} width={40} className={styles.avatar}/> 
        : <></>}
        <span className={styles.displayedName} onClick={() => setIsFriendInfoOpen(true)}>{data?.name}</span>
        <span className={styles.usertag} onClick={() => setIsFriendInfoOpen(true)}>{data?.usertag}
          {chatStore.userChats[chatID]?.isTyping 
          ? <span className={styles.typing}><Icon.AnimatedPen/> Печатает...</span> 
          : <></>}
        </span>
      </div>
    </div>
  )
}