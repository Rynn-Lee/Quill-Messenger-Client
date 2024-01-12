import Icon from '@/assets/Icons'
import styles from './dialog-list.module.sass'
import Input from '../interface/Input'
import Dialog from './dialog'
import { useChatStore } from '@store/chat-store'
import { useAccountStore } from '@store/account-store'
import { useContext, useEffect, useState } from 'react'
import { createNewChatAPI, fetchUserChatsAPI } from '@/api/chat-api'
import { inputFilter } from '@/utils/input-filter'
import { fetchUserByTagAPI } from '@/api/user-api'
import { WarningContext } from '@/lib/warning/warning-context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'
import { useMessageStore } from '@/stores/messages-store'

export default function DialogList(){
  const {userChats, setUserChats, addNewChat}: any = useChatStore()
  const {messagesHistory}: any = useMessageStore()
  const [search, setSearch]: any = useState<string>("")
  const socket: Socket | any = useContext(SocketContext)
  const warning: any = useContext(WarningContext)
  const user: any = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    if(!socket?.connected){return}
    tryCatch(async()=>{
      const result = await netRequestHandler(fetchUserChatsAPI(user._id), warning)
      setUserChats(result.data.chats)
    })
  }, [socket?.connected])

  const createNewChat = async() => {
    if(search == user.usertag){return}
    tryCatch(async()=>{
      const secondUser = await netRequestHandler(fetchUserByTagAPI(search), warning)
      const doesChatExist = userChats.filter((chat: any) => {
        if(chat.members[0] == secondUser.data._id || chat.members[1] == secondUser.data._id){
          router.push(`/chat/${chat._id}`)
          return true
        }
      })
      if(doesChatExist.length){return}
      const newChat = await netRequestHandler(createNewChatAPI(user._id, secondUser.data._id), warning)
      addNewChat(newChat.data)
    })
  }

  return(
    <div className={styles.chatlist}>
      <h2>Messages</h2>
      <div className={styles.searchBlock}>
        <Input
          onChange={(e)=>setSearch(inputFilter(e.target.value))}
          value={search}
          fancy={{text: "Search by tag", placeholder: "User Tag", background: "#1e2027", backgroundHover: "#2c2f38"}}
          type="text"/>
        <button onClick={createNewChat} className={`${styles.createChat}`}><Icon.AddUser/></button>
      </div>
      <fieldset className={styles.block}>
        <legend><Icon.Letter/> ALL MESSAGES</legend>
        {userChats?.map((chat: any) => (
          <Link
            key={chat._id}
            href={`/chat/${chat._id}`}>
            <Dialog 
              chat={chat}
              chatStore={messagesHistory[chat._id]}/>
          </Link>
        ))}
      </fieldset>
    </div>
  )
}