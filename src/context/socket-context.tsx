import { createContext, useContext, useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";
import { netRequestHandler } from "@/utils/net-request-handler";
import { tryCatch } from "@/utils/try-catch";
import { fetchLatestMessageAPI } from "@/api/message-api";
import { message, useMessageStore } from "@/stores/messages-store";
import { WarningContext, warningHook } from "@/lib/warning/warning-context";
import { chat, useChatStore } from "@/stores/chat-store";
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
    socket.on('removeChat', (data: {chatID: string}) => {
      if(activeChat.chat._id == data.chatID){
        router.push("/chat")
      }
      counterStore.resetCounter({chatID: data.chatID})
      chatStore.removeChat({chatID: data.chatID})
    })
    socket.on('removeMessage', (data: message) => {
      messagesStore.removeMessage(data)
      counterStore?.counters[data.chatID]?.counter > 0 && counterStore.decCounter({chatID: data.chatID})
    })
    socket.on('addGroup', (data: chat) => {
      chatStore.addNewChat(data)
    })
    socket.on('editUserAccount', (data: any) => {
      console.log(data)
    })
    socket.on('editGroup', (data: {_id: string, name: string, image: {format: string, code: string}}) => {
      chatStore.editChat({_id: data._id, name: data.name, image: data.image})
      if(chatStore.activeChat.chat._id == data._id){
        chatStore.setActiveChat({chat: {...chatStore.activeChat.chat, name: data.name, image: data.image}, friend: {...chatStore.activeChat.friend, displayedName: data.name, image: data.image}})
      }
      accountStore.incTrigger()
    })
    socket.on('userDeleted', (data: {userID: string}) => {
      Object.keys(chatStore.userChats).forEach((chatID) => {
        if(chatStore.userChats[chatID]?.members.includes(data.userID) && chatStore.userChats[chatID]?.members.length < 3){
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
      socket.off('removeMessage')
      socket.off('addGroup')
      socket.off('userDeleted')
      socket.off('typing')
    }
  }, [socket, activeChat, Object.keys(chatStore.userChats).length, counterStore.counters])

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