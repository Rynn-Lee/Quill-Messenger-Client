import { useRouter } from "next/router"

export default function ChatBox() {
  const router = useRouter()
  const query = router.query.chatID

  return (
    <>
      Chat box with id - {query}
    </>
  )
}
