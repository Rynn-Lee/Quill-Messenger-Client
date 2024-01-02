import { useSocketStore } from "@/stores/socket-store"
import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

export default function useSocket(_id: string){
  const [socket, setSocket]: any = useState<Socket | null>(null)
  const {status, setStatus}: any = useSocketStore()

  // connection and disconnection
  useEffect(()=>{
    if(!_id){return}

    const newSocket = io(`ws://192.168.2.100:4000/?_id=${_id}`);
    setSocket(newSocket)
    
    newSocket.on('connect', ()=> {
      setStatus(true)
      console.log("Connected to the server")
    })

    newSocket.on('disconnect', ()=>{
      setStatus(false)
      console.log("Disconnected from the server")
    })

    return () => {
      newSocket.disconnect();
    }
  }, [_id])

  const unsubscribe = (eventName: string) => {
    console.log("called unsub")
    socket.off(eventName, ()=>{
      console.log("unsubscribed from: ", eventName)
    })
  }

  const getOnlineUsers = () => {
    console.log('asked for users!')
    socket.emit('getOnlineUSers')
  }

  return {io: socket, getOnlineUsers, unsubscribe}
}