import { deleteAccount, updateUserProfileAPI } from "@/api/user-api"
import Input from "@/components/interface/Input"
import { SocketContext } from "@/context/socket-context"
import { removeItem, setItem } from "@/lib/local-storage"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import { useChatStore } from "@/stores/chat-store"
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from "@tauri-apps/api/fs"
import { useMessageStore } from "@/stores/messages-store"
import { netRequestHandler } from "@/utils/net-request-handler"
import { tryCatch } from "@/utils/try-catch"
import styles from "@styles/pages/profile.module.sass"
import Image from "next/image"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { decodeImage } from "@/utils/decodeImage"

export default function Profile() {
  const warning = useContext<warningHook>(WarningContext)
  const user = useAccountStore()
  const messagesStore = useMessageStore()
  const chatStore = useChatStore()
  const router = useRouter()
  const socket: Socket | any = useContext(SocketContext)
  const {setUser} = useAccountStore()
  const [newData, setNewData] = useState({
    avatar: user.avatar,
    displayedName: user.displayedName
  })

  const update = async() => {
    tryCatch(async()=> {
      const result = await netRequestHandler(()=>updateUserProfileAPI({_id: user._id, ...newData}), warning)
      setItem('userdata', result.data)
      setUser(result.data)
    })
  }

  const removeUser = async() => {
    tryCatch(async()=> {
      const result: {data?: any, status?: number} = await netRequestHandler(()=>deleteAccount(user._id), warning)
      console.log(result)
      if(!result?.status || result?.status >= 400) {return}

      socket.emit('userDeleted', {userID: user._id})
      const clearData = {
        _id: '',
        usertag: '',
        avatar: '',
        displayedName: '',
      }
      messagesStore.clearMessageStore()
      chatStore.clearChatStore()
      setUser(clearData)
      router.push('/')
    })
  }
  
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
      const blob = new Blob([Buffer])
      const dataUrl = `data:image/png;base64,${btoa(Buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''))}`

      await netRequestHandler(()=>updateUserProfileAPI({_id: user._id, avatar: {format: blob.type.split('/')[0], code: dataUrl}}), warning)
      setUser({...user, avatar: dataUrl})
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.profile}>
      <fieldset className={styles.block}>
        <legend>Your profile picture</legend>
        <div className={styles.avatar}><Image src={decodeImage(user.avatar)} alt="profile" width={120} height={120}/></div>
        <Input 
          value={newData.avatar}
          onChange={(e)=>setNewData({...newData, avatar: e.target.value})}/>
        <button onClick={openDialog}>Change avatar</button>
        <button onClick={removeUser}>DELETE ACCOUNT</button>
      </fieldset>
      <fieldset className={styles.block}>
        <legend>Your displayed name</legend>
        <Input 
          value={newData.displayedName}
          onChange={(e)=>setNewData({...newData, displayedName: e.target.value})}/>
        <button onClick={update}>Change displayedName</button>
      </fieldset>
    </div>
  )
}
