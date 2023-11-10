import Icon from "@/assets/Icons"
import ChatList from "../chat-list/chat-list"
import styles from "./sidebar.module.sass"
import UserBadge from "./user-badge"

export default function Sidebar({socket}: any){
  return(
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div><Icon.Quill /> <b>Quill Messenger</b></div>
        <div><Icon.Settings /></div>
      </div>
      <UserBadge styles={styles}/>
      <ChatList/>
    </div>
  )
}