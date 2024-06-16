import TopPanel from "@/components/chat/top-panel/top-panel"
import { useChatStore } from "@/stores/chat-store"
import { useRouter } from "next/router"
import styles from "@styles/pages/chat.module.sass"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { sendMessageAPI } from "@/api/message-api"
import { WarningContext, warningHook } from "@/lib/warning/warning-context"
import { useAccountStore } from "@/stores/account-store"
import Input from "@/components/interface/Input"
import Icon from "@/assets/Icons"
import { tryCatch } from "@/utils/try-catch"
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from "@tauri-apps/api/fs"
import { netRequestHandler } from "@/utils/net-request-handler"
import { SocketContext } from "@/context/socket-context"
import { Socket } from "socket.io-client/debug"
import Image from 'next/image'
import { useMessageStore } from "@/stores/messages-store"
import Messages from "@/components/chat/messages/messages"
import AboutUser from "@/components/chat/about/aboutUser"

const MemoMessages = React.memo(Messages)
const MemoTopPanel = React.memo(TopPanel)

export default function ChatBox() {
  const router = useRouter()
  const chatStore = useChatStore()
  const user = useAccountStore()
  const warning = useContext<warningHook>(WarningContext)
  const [isFriendInfoOpen, setIsFriendInfoOpen] = useState<boolean>(false)
  const chatID: string = router.query.chatID as string
  const socket: Socket | any = useContext(SocketContext)
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingTimer, setTypingTimer] = useState<any>(null);
  const {addMessage}: any = useMessageStore()

  const members = useMemo(()=>{
    return chatStore?.userChats[chatID]?.members?.filter((member) => member != user._id)
  }, [chatID])

  // useEffect(()=>{
  //   if(!messagesHistory[chatID]?.messages?.length){return}
  //   ref.current?.scrollIntoView({behavior: "smooth", block: "end"})
  // }, [messagesHistory[chatID]?.messages?.length])

  const sendNewMessage = async() => {
    if((!chatStore.userChats[chatID]?.inputMessage && !chatStore.userChats[chatID]?.attachment) || !socket){return}
    const messageType = chatStore.userChats[chatID]?.inputMessage && chatStore.userChats[chatID]?.attachment
                        ? 'media-text'
                        : chatStore.userChats[chatID]?.inputMessage && !chatStore.userChats[chatID]?.attachment
                          ? 'text'
                          : 'media'

    const textFormat : any = messageType == 'media-text'
                     ? {format: 'png', code: chatStore.userChats[chatID]?.attachment, text: chatStore.userChats[chatID]?.inputMessage}
                     : messageType == 'text'
                       ? {text: chatStore.userChats[chatID]?.inputMessage}
                       : {format: 'png', code: chatStore.userChats[chatID]?.attachment}
    
    tryCatch(async()=>{
      const sentMessage = await netRequestHandler(()=>sendMessageAPI({
        chatID,
        senderID: user._id,
        type: messageType,
        text: textFormat
      }), warning)
      socket.emit('newMessage', {message: sentMessage.data, recipientID: members})
      addMessage(sentMessage.data)
      chatStore.setInputMessage({chatID, message: ""})
      chatStore.setChatImage({chatID, image: ""})
      chatStore.setChatMessageTime({chatID, time: sentMessage.data.createdAt})
    })
  }
  
  const startTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    stopTyping()
    if(isTyping){return}
    setIsTyping(true);
    socket.emit('typing', {state: true, recipientID: members, chatID})
  };

  const stopTyping = () => {
    if(!socket){return}
    clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', {state: false, recipientID: members, chatID})
    }, 1000));
  };

  useEffect(() => {
      return () => clearTimeout(typingTimer); // Clear the timeout if the component is unmounted
  }, [typingTimer]);

  const openImageDialog = async() => {
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

      chatStore.setChatImage({chatID: chatID, image: dataUrl})
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={styles.chatBox}>

      {isFriendInfoOpen ? <AboutUser friend={chatStore.activeChat.friend} chatInfo={chatStore.userChats[chatID]} setIsFriendInfoOpen={(v: boolean)=>setIsFriendInfoOpen(v)}/> : null}

      <MemoTopPanel
        setIsFriendInfoOpen={(v: boolean)=>setIsFriendInfoOpen(v)}
        name={chatStore.activeChat?.friend?.displayedName}
        usertag={chatStore.activeChat?.friend?.usertag}
        avatar={chatStore.activeChat?.friend?.avatar}
        chatID={chatID}/>

      <MemoMessages
        chatID={chatID}
        activeChat={chatStore.activeChat}
        user={user}/>

      {chatStore?.userChats[chatID]?.attachment
      ? <div className={styles.attachment}>
          <div onClick={()=>chatStore.setChatImage({chatID, image: ''})}><Icon.AddUser color="rgb(235, 74, 74)" width="30px" height="30px"/></div>
          <Image src={chatStore?.userChats[chatID]?.attachment} width={140} height={140} alt="Image"/>
        </div>
      : null
      }
      <div className={styles.inputMessages}>
        <button className={styles.addImageButton} onClick={openImageDialog}><Icon.AddUser width="40px" height="40px" color={'#b06ce4'}/></button>
        <Input
            value={chatStore.userChats[chatID]?.inputMessage || ""}
            onChange={(e)=>{chatStore.setInputMessage({chatID, message: e.target.value});startTyping()}}
            onKeyDown={(e)=>{(e.key == "Enter" && sendNewMessage());}}
            fancy={{text: "Message", backgroundHover: "var(--messageInput)", background: "var(--messageInput)", position: "left"}}
            type="text"/>
        <button onClick={sendNewMessage}><Icon.SendArrow/></button>
      </div>
    </div>
  )
}
