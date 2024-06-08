import { createContext, useContext, useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";
import { netRequestHandler } from "@/utils/net-request-handler";
import { tryCatch } from "@/utils/try-catch";
import { fetchLatestMessageAPI } from "@/api/message-api";
import { message, useMessageStore } from "@/stores/messages-store";
import { WarningContext, warningHook } from "@/lib/warning/warning-context";
import { useChatStore } from "@/stores/chat-store";
import { useCounterStore } from "@/stores/counter-store";
import { useAccountStore } from "@/stores/account-store";

export const SocketContext: any = createContext(null)

export default function SocketWrapper({children, _id}: {children: React.ReactNode, _id: string}){
  const chatStore = useChatStore()
  const counterStore = useCounterStore()
  const accountStore = useAccountStore()
  const {activeChat} = useChatStore()
  const warning = useContext<warningHook>(WarningContext)
  const messagesStore = useMessageStore()
  const [socket, setSocket] = useState<Socket | null | any>()
  const router = useRouter()

  useEffect(()=>{
    const newSocket = io(`ws://192.168.2.100:4000/?_id=${_id}`, {
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 100
    });

    newSocket.on('connect', ()=> {
      console.log("Connected to the server!")
      newSocket["connected"] = true
      setSocket(newSocket)
    })
    newSocket.on('connect_error', (err: any)=> {
      newSocket["connected"] = false
      setSocket({...socket, connected: false})
    })
    newSocket.on('reconnecting', ()=>{
      setSocket({...socket, connected: false})
    })
    newSocket.on('reconnect', ()=>{
      newSocket["connected"] = true
      setSocket({...socket, connected: true})
    })
    newSocket.on('disconnect', ()=> {
      console.log("Disconnected from the server")
      newSocket["connected"] = false
      setSocket({...socket, connected: false})
    })
    return () => {
      newSocket.disconnect()
      newSocket.removeAllListeners()
    }
  }, [])

  useEffect(()=>{
    if(!socket?.connected){return}
    socket.on('newMessage', (data: message) => {
      if(activeChat?.chat?._id != data?.chatID){
        console.log("ADDING TO COUNTER")
        console.log(data.chatID)
        counterStore.addCounter({chatID: data.chatID})
      }
      if(!chatStore?.userChats[data.chatID]?._id){
        chatStore.addNewChat({
          _id: data.chatID,
          members: [data.senderID, accountStore._id],
          inputMessage: '',
        })
        messagesStore.setChatHistory({chatID: data.chatID, messages: []})
      }
      chatStore.setChatMessageTime({chatID: data.chatID, time: data.createdAt})
      messagesStore.addMessage(data)
    })
    socket.on('typing', (data: {chatID: string, state: boolean}) => {
      if(!chatStore?.userChats[data.chatID]?._id){return}
      console.log("TYPING", data.state)
      chatStore.setIsTyping({chatID: data.chatID, state: data.state})
    })
    socket.on('removeChat', (data: {chatID: string, recipientID: string}) => {
      console.log("REMOVE CHsAT", data)
      if(activeChat.chat._id == data.chatID){
        router.push("/chat")
      }
      counterStore.resetCounter({chatID: data.chatID})
      chatStore.removeChat({chatID: data.chatID})
    })
    socket.on('removeMessage', (data: message) => {
      messagesStore.removeMessage(data)
    })
    socket.on('userDeleted', (data: {userID: string}) => {
      console.log("REMOVE user", data)
      Object.keys(chatStore.userChats).forEach((chatID) => {
        if(chatStore.userChats[chatID]?.members.includes(data.userID)){
          counterStore.resetCounter({chatID: chatID})
          chatStore.removeChat({chatID: chatID})
          if(activeChat.chat._id == data.userID){
            router.push("/chat")
          }
        }
      })
    })
    return () => {
      socket.off('newMessage')
      socket.off('removeChat')
      socket.off('typing')
    }
  }, [socket, activeChat, Object.keys(chatStore.userChats).length])

  useEffect(()=>{
    fillMessagesPreview()
    console.log("chatStore.userChats", chatStore.userChats)
  }, [chatStore.userChats.length])

  const fillMessagesPreview = async() => {
    Object.keys(chatStore.userChats).map((chat: string) => {
      if(messagesStore?.messagesHistory[chat]?.messages?.length){return}
      tryCatch(async()=>{
        const latestMessage = await netRequestHandler(()=>fetchLatestMessageAPI(chatStore.userChats[chat]._id), warning)
        messagesStore.setChatHistory({chatID: chat, messages: latestMessage.data.reverse()})
      })
    })
  }

  return(
    <SocketContext.Provider value={socket}>
      {!socket?.connected && router.pathname != "/"? <Loading/> : <></>}
      {children}
    </SocketContext.Provider>
  )
}