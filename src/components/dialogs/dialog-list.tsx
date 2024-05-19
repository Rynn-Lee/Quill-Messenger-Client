import Icon from '@/assets/Icons'
import styles from './dialog-list.module.sass'
import Input from '../interface/Input'
import Dialog from './dialog'
import { chat, useChatStore } from '@store/chat-store'
import { useAccountStore } from '@store/account-store'
import { useContext, useEffect, useState } from 'react'
import { createNewChatAPI, fetchUserChatsAPI } from '@/api/chat-api'
import { inputFilter } from '@/utils/input-filter'
import { fetchUserByTagAPI } from '@/api/user-api'
import { WarningContext, warningHook } from '@/lib/warning/warning-context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'
import { useMessageStore } from '@/stores/messages-store'

export default function DialogList(){
  const chatStore = useChatStore()
  const [tab, setTab] = useState<'direct' | 'groups'>('direct')
  const messagesStore = useMessageStore()
  const [search, setSearch] = useState<string>("")
  const socket: Socket | any = useContext(SocketContext)
  const warning = useContext<warningHook>(WarningContext)
  const user = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    if(!socket?.connected){return}
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>fetchUserChatsAPI(user._id), warning)
      let newObj: any = {}
      result.data?.chats?.map(async (chat: chat) => {
        newObj[chat._id] = {...chat, isTyping: false, lastMessage: messagesStore.messagesHistory[chat._id]?.messages[messagesStore.messagesHistory[chat._id]?.messages.length-1]?.createdAt, inputMessage: ""}
      })
      chatStore.setUserChats(newObj)
    })
  }, [socket?.connected])

  const createNewChat = async() => {
    if(search == user.usertag){return}
    tryCatch(async()=>{
      const secondUser = await netRequestHandler(()=>fetchUserByTagAPI(search), warning)
      const doesChatExist = Object.keys(chatStore.userChats).filter((chat: any) => {
        if(chatStore.userChats[chat].members[0] == secondUser.data._id || chatStore.userChats[chat].members[0] == secondUser.data._id){
          router.push(`/chat/${chat._id}`)
          return true
        }
      })
      if(doesChatExist.length){return}
      const newChat = await netRequestHandler(()=>createNewChatAPI(user._id, secondUser.data._id), warning)
      chatStore.addNewChat(newChat.data)
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
      <div className={styles.listTabs}>
        <div className={tab == 'direct' ? styles.activeTab : ""} onClick={() => setTab('direct')}>Direct</div>
        <div className={tab == 'groups' ? styles.activeTab : ""} onClick={() => setTab('groups')}>Groups</div>
      </div>
      <fieldset className={styles.block}>
        {Object.keys(chatStore.userChats)
                .filter((chat: any) => tab == 'direct' ? chatStore.userChats[chat].members.length == 2 : chatStore.userChats[chat].members.length > 2)
                .map((keyname: string) => (
          <Link
            key={chatStore.userChats[keyname]._id}
            href={`/chat/${chatStore.userChats[keyname]._id}`}>
            <Dialog 
              chat={chatStore.userChats[keyname]}
              messagesStore={messagesStore.messagesHistory[chatStore.userChats[keyname]._id]}/>
          </Link>
        )).sort((a: any, b: any) => {
            return Date.parse(chatStore?.userChats[b.key]?.lastMessage) - Date.parse(chatStore?.userChats[a.key]?.lastMessage)
        })}
      </fieldset>
    </div>
  )
}