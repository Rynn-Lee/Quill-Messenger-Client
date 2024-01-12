import { createContext, useContext, useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";
import { netRequestHandler } from "@/utils/net-request-handler";
import { tryCatch } from "@/utils/try-catch";
import { fetchLatestMessageAPI } from "@/api/message-api";
import { useChatStore } from "@/stores/chat-store";
import { useMessageStore } from "@/stores/messages-store";
import { WarningContext } from "@/lib/warning/warning-context";

export const SocketContext: any = createContext(null)

export default function SocketWrapper({children, _id}: any){
  const {userChats}: any = useChatStore()
  const warning = useContext(WarningContext)
  const {addMessage, setChatHistory, setIsTyping}: any = useMessageStore()
  const [socket, setSocket] = useState<Socket | null | any>()
  const router = useRouter()


  useEffect(()=>{
    //New socket.io connection won't be created if on the logging page
    if(router.pathname == "/"){return}
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
  }, [router.pathname])

  //Delete socket.io instance after logging out
  useEffect(()=>{
    if(router.pathname != "/" || !socket){return}
    socket.disconnect()
    setSocket(null)
  }, [router.pathname])

  useEffect(()=>{
    if(!socket?.connected){return}
    socket.on('newMessage', (data: any) => {
      addMessage(data)
    })
    socket.on('typing', (data: any) => {
      setIsTyping({chatID: data.chatID, state: data.state})
    })
    return () => {
      socket.off('newMessage')
      socket.off('typing')
    }
  }, [socket])

  useEffect(()=>{
    fillMessagesPreview()
  }, [userChats])

  const fillMessagesPreview = async() => {
    for(let i = 0; i < userChats.length; i++){
      tryCatch(async()=>{
        const latestMessage = await netRequestHandler(fetchLatestMessageAPI(userChats[i]._id), warning)
        setChatHistory({chatID: userChats[i]._id, messages: latestMessage.data.reverse()})
      })
    }
  }

  return(
    <SocketContext.Provider value={socket}>
      {!socket?.connected && router.pathname != "/"? <Loading/> : <></>}
      {children}
    </SocketContext.Provider>
  )
}