import { createContext, useContext, useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";
import { netRequestHandler } from "@/utils/net-request-handler";
import { tryCatch } from "@/utils/try-catch";
import { fetchLatestMessage, fetchMessages } from "@/api/chat-api";
import { useChatStore } from "@/stores/chat-store";
import { useMessageStore } from "@/stores/messages-store";
import { WarningContext } from "@/lib/warning/warning-context";

export const SocketContext: any = createContext(null)

export default function SocketWrapper({children, _id}: any){
  const {activeChat, userChats}: any = useChatStore()
  const warning = useContext(WarningContext)
  const {addMessage, setChatHistory, messageHistory}: any = useMessageStore()
  const [socket, setSocket] = useState<Socket | null | any>()
  const router = useRouter()


  useEffect(()=>{
    //New socket.io connection won't be created if on the logging page
    if(router.pathname == "/"){return}
    const newSocket = io(`ws://192.168.2.100:4000/?_id=${_id}`, {
      reconnection: true, // включить повторное подключение
      reconnectionDelay: 2000, // интервал между попытками (в миллисекундах)
      reconnectionAttempts: 100 // максимальное количество попыток
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
    // socket.on('typing', (data: any) => {
    //   if(data.ChatID != ChatID){ return }
    //   setIsOpponentTyping(data.state)
    // })
    return () => {
      socket.off('newMessage')
      // socket.off('typing')
    }
  }, [socket])

  useEffect(()=>{
    fillMessagesPreview()
  }, [userChats])

  const fillMessagesPreview = async() => {
    for(let i = 0; i < userChats.length; i++){
      tryCatch(async()=>{
        const latestMessage = await netRequestHandler(fetchLatestMessage(userChats[i]._id), warning)
        console.log("LAST MESSAGES", latestMessage)
        setChatHistory({ChatID: userChats[i]._id, messages: latestMessage.data})
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