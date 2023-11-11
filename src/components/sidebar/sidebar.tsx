import Icon from "@/assets/Icons"
import ChatList from "../messages/messages"
import styles from "./sidebar.module.sass"
import UserBadge from "./user-badge"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Sidebar({socket}: any){
  const [activePage, setActivePage] = useState("/")
  const router = useRouter()

  useEffect(()=>{
    console.log(router.pathname)
    setActivePage(router.pathname)
  }, [router.pathname])

  return(
    <div className={styles.sidebar}>
      <div className={styles.upperButtons}>
        <Icon.Quill /><hr className={styles.hr}/>
        <Link className={activePage == "/chats" ? styles.activePage : ""} href="/chats">{activePage == "/chats" ? <Icon.MessagesActive/> : <Icon.Messages />}</Link>
        <Link className={activePage == "/add-friends" ? styles.activePage : ""} href="/add-friends">{activePage == "/add-friends" ? <Icon.PeopleActive/> : <Icon.People />}</Link>
      </div>
      <div className={styles.bottomButtons}>
        <Link className={activePage == "/settings" ? styles.activePage : ""} href="/settings">{activePage == "/settings" ? <Icon.SettingsActive/> : <Icon.Settings />}</Link>
        <Link href="/"><Icon.Logout/></Link>
        <hr className={styles.hr}/>
        <Link className={`${styles.linkUserImage} ${activePage == "/profile" ? styles.activePage : ""}`} href="/profile">
          <Image className={styles.userImage} src="https://avatars.githubusercontent.com/u/38906839?v=4" alt="pfp" width={40} height={40}/>
        </Link>
      </div>
    </div> 
  )
}