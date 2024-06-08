import Icon from "@/assets/Icons"
import styles from "./sidebar.module.sass"
import Image from "next/image"
import Link from "next/link"
import { memo, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { logoutAPI } from "@/api/user-api"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import { useChatStore } from "@/stores/chat-store"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client"
import { useCounterStore } from "@/stores/counter-store"
import { decodeImage } from "@/utils/decodeImage"

const MemoSidebar = memo(function Sidebar(){
  const [activePage, setActivePage] = useState("/")
  const counterStore = useCounterStore()
  const socket: Socket | any = useContext(SocketContext);
  const user = useAccountStore()
  const chat = useChatStore()
  const warning = useContext<warningHook>(WarningContext)
  const router = useRouter()

  const avatar: any = useMemo(()=>{
    return decodeImage(user.avatar)
  }, [user.avatar])

  const counters = useMemo(()=>{
    return counterStore.countersAmount()
  }, [counterStore.countersAmount()])

  const logout = () => {
    logoutAPI()
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
        <Link className={activePage == "/chat" ? styles.activePage : ""} href={`${chat.activeChat?.chat?._id ? `/chat/${chat.activeChat.chat._id}` : `/chat`}`}>
          {counters ? <div className={styles.counterDot} onContextMenu={(e)=>{e.preventDefault(); counterStore.removeCounters()}}>{counters}</div> : null}
          {activePage == "/chat" ? <Icon.MessagesActive/> : <Icon.Messages width="26px" height="26px" color="#cccccc"/>}
        </Link>
        <Link className={activePage == "/discover" ? styles.activePage : ""} href="/discover">{activePage == "/discover" ? <Icon.DiscoverActive/> : <Icon.Discover />}</Link>
      </div>
      <div className={styles.bottomButtons}>
        <Link className={activePage == "/settings" ? styles.activePage : ""} href="/settings">{activePage == "/settings" ? <Icon.SettingsActive/> : <Icon.Settings />}</Link>
        <Link onClick={()=>warning.showWindow({title: "Confirm Action", message: "Are you sure you want to leave?", fn: logout})} href="#"><Icon.Logout/></Link>
        <hr className={styles.hr}/>
        <Link className={`${styles.linkUserImage} ${activePage == "/profile" ? styles.activePage : ""}`} href="/profile">
          {user.avatar ? <Image
            className={`${styles.userImage} ${socket?.connected ? styles.connected : styles.disconnected}`}
            src={avatar}
            alt="pfp" width={40} height={40}/> : <div>none</div>}
        </Link>
      </div>
    </div> 
  )
})

export default MemoSidebar