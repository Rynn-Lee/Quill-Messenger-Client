import Icon from "@/assets/Icons"
import styles from "./sidebar.module.sass"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { logout } from "@/api/user-api"
import { WarningContext } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import { useChatStore } from "@/stores/chat-store"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client"

export default function Sidebar(){
  const [activePage, setActivePage] = useState("/")
  const socket: Socket | any = useContext(SocketContext);
  const user: any = useAccountStore()
  const chat: any = useChatStore()
  const warning: any = useContext(WarningContext)
  const router = useRouter()

  const leave = () => {
    logout()
    user.clearAccountStore()
    chat.clearChatStore()
    router.replace('/')
  }

  useEffect(()=>{
    const pathname = router.pathname.split('/')
    if(pathname.includes('chat')){
      setActivePage('/chat')
      return
    }
    setActivePage(router.pathname)
  }, [router.pathname])

  return(
    <div className={styles.sidebar}>
      <div className={styles.upperButtons}>
        <Icon.Quill />
        <hr className={styles.hr}/>
        <Link className={activePage == "/chat" ? styles.activePage : ""} href={`${chat.activeChat?.chat?._id ? `/chat/${chat.activeChat.chat._id}` : `/chat`}`}>{activePage == "/chat" ? <Icon.MessagesActive/> : <Icon.Messages />}</Link>
        <Link className={activePage == "/groups" ? styles.activePage : ""} href="/groups">{activePage == "/groups" ? <Icon.PeopleActive/> : <Icon.People />}</Link>
        <Link className={activePage == "/discover" ? styles.activePage : ""} href="/discover">{activePage == "/discover" ? <Icon.DiscoverActive/> : <Icon.Discover />}</Link>
      </div>
      <div className={styles.bottomButtons}>
        <Link className={activePage == "/settings" ? styles.activePage : ""} href="/settings">{activePage == "/settings" ? <Icon.SettingsActive/> : <Icon.Settings />}</Link>
        <Link onClick={()=>warning.showWindow({title: "Confirm Action", message: "Are you sure you want to exit?", fn: leave})} href="#"><Icon.Logout/></Link>
        <hr className={styles.hr}/>
        <Link className={`${styles.linkUserImage} ${activePage == "/profile" ? styles.activePage : ""}`} href="/profile">
          {user.avatar ? <Image
            className={`${styles.userImage} ${socket?.connected ? styles.connected : styles.disconnected}`}
            src={user.avatar}
            alt="pfp" width={40} height={40}/> : <></>}
        </Link>
      </div>
    </div> 
  )
}