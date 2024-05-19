import { fetchAllUsersAPI, fetchUserByTagAPI } from "@/api/user-api"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { chat, userData } from "@/types/types"
import styles from '@/styles/pages/discover.module.sass'
import { netRequestHandler } from "@/utils/net-request-handler"
import { useContext, useEffect, useState } from "react"
import Image from "next/image"
import Icon from "@/assets/Icons"
import { calculateDate } from "@/utils/calculate-date"
import { useRouter } from "next/router"
import { tryCatch } from "@/utils/try-catch"
import { useChatStore } from "@/stores/chat-store"
import { createNewChatAPI } from "@/api/chat-api"
import { useAccountStore } from "@/stores/account-store"

export default function Discover() {
  const [users, setUsers] = useState<userData[]>([])
  const router = useRouter()
  const account = useAccountStore()
  const warning = useContext<warningHook>(WarningContext)
  const chatStore = useChatStore()

  useEffect(()=>{
    !users?.length && fetchUsers()
  }, [])
  
  const fetchUsers = async() => {
    const result = await netRequestHandler(() => fetchAllUsersAPI(), warning)
    setUsers(result.data)
  }

  const createNewChat = async(user: userData) => {
    tryCatch(async()=>{
      const secondUser = await netRequestHandler(()=>fetchUserByTagAPI(user.usertag), warning)
      const doesChatExist = Object.keys(chatStore.userChats).filter((chatID: string) => {
        if(chatStore.userChats[chatID].members[0] == secondUser.data._id || chatStore.userChats[chatID].members[0] == secondUser.data._id){
          // changeChat(chatStore.userChats[chatID], secondUser.data)
          console.log("chatID", chatID)
          router.push(`/chat/${chatID}`)
          return true
        }
      })
      if(doesChatExist.length){return}
      console.log("Chat doesnt exist!!!!!!")
      const newChat = await netRequestHandler(()=>createNewChatAPI(account._id, secondUser.data._id), warning)
      chatStore.addNewChat(newChat.data)
      // changeChat(newChat.data, secondUser.data)
    })
  }

  // const changeChat = (chat: chat, opponent: userData) => {
  //   chatStore.setActiveChat({chat, friend: opponent})
  // }

  return (
    <div className={styles.page}>
      <span className={styles.title}>✨ Discover new friends to talk with!</span>
      <div className={styles.users}>
        {users?.map((user: userData) => (
          <div className={styles.user} key={user._id}>
            <div className={styles.pfpblock}>
              <Image src={user.avatar} width={70} height={70} alt="avatar"/>
            </div>
            <div className={styles.infoblock}>
              <div>
                <span className={styles.row + " " + styles.username}>{user.displayedName}</span>
                <span className={styles.row}><Icon.User/> {user.usertag}</span>
                <span className={styles.row}><Icon.Calendar color="#fff" width="26px" height="20px"/> {calculateDate(user.createdAt.toString(), 'fullshort')}</span>
              </div>
              <button onClick={()=>{createNewChat(user)}}><Icon.Letter/> Написать</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
