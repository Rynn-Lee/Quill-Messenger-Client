import { changePasswordAPI, deleteAccount, updateUserProfileAPI } from "@/api/user-api"
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
import { useContext, useEffect, useMemo, useState } from "react"
import { Socket } from "socket.io-client"
import { decodeImage } from "@/utils/decodeImage"
import Icon from "@/assets/Icons"

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
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const update = async() => {
    tryCatch(async()=> {
      const result = await netRequestHandler(()=>updateUserProfileAPI({_id: user._id, ...newData}), warning)
      setItem('userdata', result.data)
      setUser(result.data)
      socket.emit('editUserAccount', newData)
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

  const avatar: any = useMemo(()=>{
    return decodeImage(user.avatar)
  },[user.avatar])

  const updatePassword = async() => {
    if(!passwords.newPassword || !passwords.oldPassword || !passwords.confirmPassword || passwords.newPassword !== passwords.confirmPassword) {return}
    tryCatch(async()=> {
      const result = await netRequestHandler(()=>changePasswordAPI({userId: user._id, oldPassword: passwords.oldPassword, newPassword: passwords.newPassword}), warning)
      if(!result){return}
      setPasswords({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    })
  }

  return (
    <div className={styles.profile}>
      <fieldset className={styles.block}>
        <legend>Ваше изображение профиля</legend>
        <div className={styles.avatar}><Image src={avatar} alt="profile" width={120} height={120}/></div>
        <div style={{display: 'flex', padding: 0, margin: 0}}>
          <button onClick={openDialog} style={{flex: 3}}>Выбрать</button>
          <button onClick={removeUser} style={{flex: 1}}><Icon.Remove height="24px" width="24px" color="#ffffff"/></button>
        </div>
      </fieldset>
      <fieldset className={styles.block}>
        <legend>Ваш никнейм</legend>
        <Input 
          value={newData.displayedName}
          onChange={(e)=>setNewData({...newData, displayedName: e.target.value})}/>
        <button onClick={update}>Изменить никнейм</button>
      </fieldset>
      <fieldset className={styles.block}>
        <legend>Сменить пароль</legend>
        <Input 
          value={passwords.oldPassword}
          placeholder="Текущий пароль"
          type="password"
          onChange={(e)=>setPasswords({...passwords, oldPassword: e.target.value})}/>
        <Input 
          value={passwords.newPassword}
          placeholder="Новый пароль"
          type="password"
          onChange={(e)=>setPasswords({...passwords, newPassword: e.target.value})}/>
        <Input
          placeholder="Подтвердите пароль"
          value={passwords.confirmPassword}
          type="password"
          onChange={(e)=>setPasswords({...passwords, confirmPassword: e.target.value})}/>
        <button onClick={updatePassword}>Сменить пароль</button>
      </fieldset>
    </div>
  )
}
