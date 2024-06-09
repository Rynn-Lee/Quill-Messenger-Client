import Icon from '@/assets/Icons'
import styles from './dialog-list.module.sass'
import Input from '../interface/Input'
import Dialog from './dialog'
import Image from 'next/image'
import { chat, friend, useChatStore } from '@store/chat-store'
import { useAccountStore } from '@store/account-store'
import { Fragment, memo, useContext, useEffect, useMemo, useState } from 'react'
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from "@tauri-apps/api/fs"
import { createNewChatAPI, deleteChatAPI, fetchUserChatsAPI } from '@/api/chat-api'
import { inputFilter } from '@/utils/input-filter'
import { fetchAllUsersAPI, fetchUserByTagAPI } from '@/api/user-api'
import { WarningContext, warningHook } from '@/lib/warning/warning-context'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { netRequestHandler } from '@/utils/net-request-handler'
import { tryCatch } from '@/utils/try-catch'
import { SocketContext } from '@/context/socket-context'
import { Socket } from 'socket.io-client'
import { useMessageStore } from '@/stores/messages-store'
import { useCounterStore } from '@/stores/counter-store'
import { decodeImage } from '@/utils/decodeImage'
import { userData } from '@/types/types'
import { createNewGroupAPI, deleteGroupChatAPI } from '@/api/group-api'

export default function DialogList(){
  const [deleteId, setDeleteId] = useState<string>("")
  const [groupCreateMode, setGroupCreateMode] = useState<boolean>(false)
  const chatStore: any = useChatStore()
  const [tab, setTab] = useState<'direct' | 'groups'>('direct')
  const messagesStore = useMessageStore()
  const [search, setSearch] = useState<string>("")
  const counterStore = useCounterStore()
  const socket: Socket | any = useContext(SocketContext)
  const warning = useContext<warningHook>(WarningContext)
  const user = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    if(!socket?.connected){return}
    tryCatch(async()=>{
      const result = await netRequestHandler(()=>fetchUserChatsAPI(user._id), warning)
      let newObj: any = {}
      result.data?.map(async (chat: chat) => {
        newObj[chat._id] = {...chat, isTyping: false, lastMessage: messagesStore.messagesHistory[chat._id]?.messages[messagesStore.messagesHistory[chat._id]?.messages.length-1]?.createdAt, inputMessage: ""}
      })
      chatStore.setUserChats(newObj)
    })
  }, [socket?.connected])


  const createNewChat = async() => {
    console.log('CREATE ONE')
    if(search == user.usertag){return}
    console.log('CREATE TWO')
    tryCatch(async()=>{
      const secondUser = await netRequestHandler(()=>fetchUserByTagAPI(search), warning)
      const doesChatExist = Object.keys(chatStore.userChats).filter((chat: any) => {
        if(chatStore.userChats[chat].members[0] == secondUser.data._id || chatStore.userChats[chat].members[0] == secondUser.data._id){
          router.push(`/chat/${chat._id}`)
          console.log('CHAT EXISTS', chat)
          return true
        }
      })
      if(doesChatExist.length){return}
      const newChat = await netRequestHandler(()=>createNewChatAPI(user._id, secondUser.data._id), warning)
      console.log(newChat.data)
      chatStore.addNewChat(newChat.data)
      router.push(`/chat/${newChat.data._id}`)
    })
  }

  const chooseDeleteId = (id: string) => {
   if(deleteId == id){setDeleteId("")} else {setDeleteId(id)}
  }

  const deleteChat = (chatInfo: {_id: string, members: string[], type: 'group' | undefined}, opponentData: friend) => {
    console.log("ITIN INFO --------------------------------", chatInfo)
    warning.showWindow({title: "Delete chat", message: `Are you sure you want to delete this chat? You won't be able to recover this chat!`, fn: async()=>{
      if('image' in chatInfo){
        console.log("DELETING GROUP", chatInfo)
        await netRequestHandler(()=>deleteGroupChatAPI(deleteId), warning)
      } else {
        console.log("DELETING USER", chatInfo)
        await netRequestHandler(()=>deleteChatAPI(deleteId), warning)
      }

      console.log("delete chat info", chatInfo.members)
      socket.emit('removeChat', {chatID: deleteId, recipientID: chatInfo.members})
      console.log("EVENT TO DELETE CHATS")
      counterStore.resetCounter({chatID: deleteId})
      if(chatStore.activeChat.chat._id == deleteId){router.push('/chat')}
      chatStore.removeChat({chatID: deleteId})
      setDeleteId("")
    }})
  }

  return(
    <div className={styles.chatlist}>
      {groupCreateMode ? <CreateGroupWindow setGroupCreateMode={setGroupCreateMode}/> : null}
      <h2>Messages</h2>
      <div className={styles.searchBlock}>
        {tab=="groups" ? 
        <button className={styles.createAgroup} onClick={()=>setGroupCreateMode(!groupCreateMode)}>
          Create a new group
        </button>
        : <><Input
            onChange={(e)=>setSearch(inputFilter(e.target.value))}
            value={search}
            fancy={{text: "Search by tag", placeholder: "User Tag", background: "#1e2027", backgroundHover: "#2c2f38"}}
            type="text"/>
            <button onClick={createNewChat} className={`${styles.createChat}`}><Icon.AddUser color="#9851da" width='32px' height='32px'/></button></>
        }
        
      </div>
      <div className={styles.listTabs}>
        <div className={tab == 'direct' ? styles.activeTab : ""} onClick={() => setTab('direct')}>Direct</div>
        <div className={tab == 'groups' ? styles.activeTab : ""} onClick={() => setTab('groups')}>Groups</div>
      </div>
      <div className={styles.block} style={{padding: 0, margin: 0, overflowX: "hidden"}}>
        <div style={{display: tab == 'direct' ? 'flex' : 'none'}}><UserList deleteChat={deleteChat} chooseDeleteId={chooseDeleteId} deleteId={deleteId} messagesStore={messagesStore}/></div>
        <div style={{display: tab != 'direct' ? 'flex' : 'none'}}><GroupList deleteChat={deleteChat} chooseDeleteId={chooseDeleteId} deleteId={deleteId} messagesStore={messagesStore}/></div>
      </div>
    </div>
  )
}

const UserList = ({ deleteChat, chooseDeleteId, deleteId, messagesStore }: any) => {
  const chatStore = useChatStore()
  return (
    <div>
      {Object.keys(chatStore.userChats)
        .filter((chat: any) => !('image' in chatStore?.userChats[chat]))
        .map((keyname: string) => (
          <Link
            key={chatStore.userChats[keyname]._id}
            href={`/chat/${chatStore.userChats[keyname]._id}`}
          >
            <Dialog
              deleteChat={deleteChat}
              chooseDeleteId={chooseDeleteId}
              deleteId={deleteId}
              chat={chatStore.userChats[keyname]}
              messagesStore={messagesStore.messagesHistory[chatStore.userChats[keyname]._id]}
            />
          </Link>
        ))
        .sort((a: any, b: any) => {
          return Date.parse(chatStore?.userChats[b.key]?.lastMessage) - Date.parse(chatStore?.userChats[a.key]?.lastMessage);
        })}
    </div>
  );
};


const GroupList = ({ deleteChat, chooseDeleteId, deleteId, messagesStore }: any) => {
  const chatStore = useChatStore()
  return (
    <div>
      {Object.keys(chatStore.userChats)
        .filter((chat: any) => chatStore?.userChats[chat]?.members?.length > 2)
        .map((keyname: string) => (
          <Link
            key={chatStore.userChats[keyname]._id}
            href={`/chat/${chatStore.userChats[keyname]._id}`}
          >
            <Dialog
              deleteChat={deleteChat}
              chooseDeleteId={chooseDeleteId}
              deleteId={deleteId}
              chat={chatStore.userChats[keyname]}
              messagesStore={messagesStore.messagesHistory[chatStore.userChats[keyname]._id]}
            />
          </Link>
        ))
        .sort((a: any, b: any) => {
          return Date.parse(chatStore?.userChats[b.key]?.lastMessage) - Date.parse(chatStore?.userChats[a.key]?.lastMessage);
        })}
    </div>
  );
};

export function CreateGroupWindow({setGroupCreateMode}: {setGroupCreateMode: Function}){
  const warning = useContext<warningHook>(WarningContext)
  const socket: Socket | any = useContext(SocketContext)
  const accountStore = useAccountStore()
  const chatStore = useChatStore()
  const [step, setStep] = useState(0)
  const [users, setUsers] = useState<userData[]>([])
  const [groupData, setGroupData] = useState<{name: string, members: string[], avatar: string}>({
    name: "",
    members: [accountStore._id],
    avatar: "",
  })

  const openDialog = async () => {
    try{
      const selectedPath = await open({
        multiple: false,
        filters: [
          {
            name: "Image",
            extensions: ["png", "jpg", "jpeg", 'webp', 'gif']
          }
        ],
        title: "Choose a photo"
      })
      if(!selectedPath) return;
      const Buffer = await readBinaryFile(selectedPath as string)
      const dataUrl = `data:image/png;base64,${btoa(Buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''))}`
      
      setGroupData({...groupData, avatar: dataUrl})
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    (async()=>{
      const users = await netRequestHandler(()=>fetchAllUsersAPI(), warning)
      if(!users) return
      setUsers(users.data)
    })()
  },[])

  const groupImage: any = useMemo(()=>{
    return decodeImage(groupData.avatar)
  }, [groupData.avatar])

  const handleUserClick = (userid: string) => {
    if(groupData.members.includes(userid)){
      setGroupData({...groupData, members: groupData.members.filter((id: string) => id != userid)})
      return
    }
    setGroupData({...groupData, members: [...groupData.members, userid]})
  }

  const finishCreatingGroup = async () => {
    const result = await createNewGroupAPI(groupData.name, {format: 'jpg', code: groupData.avatar}, groupData.members)
    socket.emit('createGroup', {recipientID: groupData.members, data: result.data})
    chatStore.addNewChat(result.data)
    setGroupCreateMode(false)
    setStep(0)
  }

  return(
    <div className={styles.createGroupWrapper} onClick={()=>setGroupCreateMode(false)}>
      <div className={styles.createGroup} onClick={(e)=>e.stopPropagation()}>
        {step == 0
          ? <><div onClick={openDialog}>
                {groupData.avatar
                ? <Image src={groupImage} className={styles.avatar} alt="avatar" width={40} height={40}/>
                : <div className={styles.avatar}>Select</div>
                }
              </div>
              <div className={styles.groupInfo}>
                <p className={styles.title}>Group Name</p>
                <input onChange={(e)=>setGroupData({...groupData, name: e.target.value})} type="text" value={groupData.name}/>
                <button onClick={()=>setStep(1)} disabled={!groupData.name}>Continue</button>
              </div></>
        : <div className={styles.invitePeople}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <span className={styles.title}>Invite People</span>
                <span>Selected: {groupData.members.length-1}</span>
              </div>
              <button className={styles.finishCreating} onClick={()=>finishCreatingGroup()} style={{background: "#00000000", border: "none"}}><Icon.SendArrow /></button>
            </div>
            {users.map((user: userData) => {
              if(user._id == accountStore._id) return null
              const image: any = decodeImage(user.avatar.code)
              return(
              <div key={user._id} className={`${styles.userDiv} ${groupData.members.includes(user._id) ? styles.selected : ""}`} onClick={()=>handleUserClick(user._id)}>
                <Image src={image} className={styles.userAvatars} alt="avatar" width={40} height={40}/>
                <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                  <span className={styles.username}>{user.displayedName}</span>
                  <span className={styles.username}>{user.usertag}</span>
                </div>
              </div>)
            })}
          </div>
        }
      </div>
    </div>
  )
}