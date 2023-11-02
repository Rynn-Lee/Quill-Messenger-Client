import Icon from "@/assets/Icons"
import Message from "./message/message"

export default function ChatList({styles}: any){
  return(
    <>
    <div className={styles.title}>
      <div><Icon.Chat /><b>Direct Messages</b></div>
      <div><Icon.Friends /></div>
    </div>
    <div className={styles.ChatList}>
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
    </>
  )
}