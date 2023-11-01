import styles from "./chat-list.module.sass"
import Message from "./message/message"

export default function ChatList(){
  return(
    <div className={styles.ChatList}>
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  )
}