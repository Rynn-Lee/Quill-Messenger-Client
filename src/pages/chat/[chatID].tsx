import TopPanel from "@/components/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"

export default function ChatBox() {
  const router = useRouter()
  const {activeChat}: any = useChatStore()
  const query = router.query.chatID

  return (
    <div className={styles.chatBox}>
      <TopPanel
        name={activeChat?.friend?.displayedName}
        usertag={activeChat?.friend?.usertag}
        avatar={activeChat?.friend?.avatar}/>
      <div className={styles.chatContent}>
        Chat box with id - {query}
      </div>
    </div>
  )
}
