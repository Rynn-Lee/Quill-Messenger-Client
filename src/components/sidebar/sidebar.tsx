import Icon from "@/assets/Icons"
import ChatList from "../chat-list/chat-list"
import styles from "./sidebar.module.sass"
import TopBlock from "./top-block/top-block"

export default function Sidebar(){
  return(
    <div className={styles.sidebar}>
      <div className={styles.logo}><Icon.Quill /><b>Quill</b></div>
      <TopBlock />
      <ChatList />
    </div>
  )
}