import Icon from "@/assets/Icons"
import styles from "./sidebar.module.sass"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { logout } from "@/api"
import { useSocketStore } from "@/stores/SocketStore"
import { WarningContext } from "@/lib/warning/warning-context"

export default function Sidebar(){
  const {status}: any = useSocketStore()
  const warning: any = useContext(WarningContext)
  const [activePage, setActivePage] = useState("/")
  const router = useRouter()

  const leave = () => {
    logout()
    router.replace('/')
  }

  useEffect(()=>{ setActivePage(router.pathname) }, [router.pathname])
  return(
    <div className={styles.sidebar}>
      <div className={styles.upperButtons}>
        <Icon.Quill />
        <hr className={styles.hr}/>
        <Link className={activePage == "/chats" ? styles.activePage : ""} href="/chats">{activePage == "/chats" ? <Icon.MessagesActive/> : <Icon.Messages />}</Link>
        <Link className={activePage == "/add-friends" ? styles.activePage : ""} href="/add-friends">{activePage == "/add-friends" ? <Icon.PeopleActive/> : <Icon.People />}</Link>
        <Link className={activePage == "/discover" ? styles.activePage : ""} href="/discover">{activePage == "/discover" ? <Icon.DiscoverActive/> : <Icon.Discover />}</Link>
      </div>
      <div className={styles.bottomButtons}>
        <Link className={activePage == "/settings" ? styles.activePage : ""} href="/settings">{activePage == "/settings" ? <Icon.SettingsActive/> : <Icon.Settings />}</Link>
        <Link onClick={()=>warning.showWindow({title: "Confirm Action", message: "Are you sure you want to exit?", fn: leave})} href="/"><Icon.Logout/></Link>
        <hr className={styles.hr}/>
        <Link className={`${styles.linkUserImage} ${activePage == "/profile" ? styles.activePage : ""}`} href="/profile">
          <Image
            className={`${styles.userImage} ${status ? styles.connected : styles.disconnected}`}
            src="https://avatars.githubusercontent.com/u/38906839?v=4"
            alt="pfp" width={40} height={40}/>
        </Link>
      </div>
    </div> 
  )
}