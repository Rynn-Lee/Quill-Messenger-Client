import Icon from "@/assets/Icons"
import ChatList from "../chat-list/chat-list"
import styles from "./sidebar.module.sass"
import UserBadge from "./UserBadge"

export default function Sidebar(){
  return(
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div><Icon.Quill /> <b>Quill Messenger</b></div>
        <div><Icon.Settings /></div>
      </div>
      <UserBadge styles={styles}/>
      <ChatList styles={styles}/>
    </div>
  )
}