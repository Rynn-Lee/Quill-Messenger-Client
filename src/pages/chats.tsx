import { useAccountStore } from "@/stores/AccountStore"

export default function Chats() {
  const {usertag, password}: any = useAccountStore()

  return (
    <>
      Chats - {usertag} - {password}
    </>
  )
}
