import Icon from '@/assets/Icons'
import styles from './chatlist.module.sass'
import Input from '../interface/Input'
import Message from '../message/message'
import { useChatStore } from '@store/chat-store'
import { useAccountStore } from '@store/account-store'
import { useContext, useEffect, useState } from 'react'
import { createChat, getChats } from '@/api/chat-api'
import { inputFilter } from '@/utils/input-filter'
import { fetchUserTag } from '@/api/user-api'
import { WarningContext } from '@/lib/warning/warning-context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'

export default function ChatList(){
  const {userChats, setUserChats, addNewChat}: any = useChatStore()
  const [search, setSearch]: any = useState<string>("")
  const socket: Socket | any = useContext(SocketContext)
  const warning: any = useContext(WarningContext)
  const user: any = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    !userChats.length && user._id && socket?.connected && fetchChats()
  }, [user._id, socket?.connected])

  const fetchChats = async() => {
    tryCatch(async()=>{
      const result = await netRequestHandler(getChats(user._id), warning)
      console.log("Fetched chats", result)
      setUserChats(result.data.chats)
    })
  }

  const addNewUserChat = async() => {
    if(search == user.usertag){return}
    tryCatch(async()=>{
      const secondUser = await netRequestHandler(fetchUserTag(search), warning)
      const doesChatExist = userChats.filter((chat: any) => {
        if(chat.members[0] == secondUser.data._id || chat.members[1] == secondUser.data._id){
          router.push(`/chat/${chat._id}`)
          return true
        }
      })
      if(doesChatExist.length){return}
      const newChat = await createChat(user._id, secondUser.data._id)
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
        <button onClick={addNewUserChat} className={`${styles.createChat}`}><Icon.AddUser/></button>
      </div>
      <fieldset className={styles.block}>
        <legend><Icon.Letter/> ALL MESSAGES</legend>
        {userChats?.map((chat: any) => (
          <Link
            key={chat._id}
            href={`/chat/${chat._id}`}>
            <Message chat={chat}/>
          </Link>
        ))}
      </fieldset>
    </div>
  )
}