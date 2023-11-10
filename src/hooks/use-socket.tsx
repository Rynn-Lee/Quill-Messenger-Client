import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

export default function useSocket(){
  const [socket, setSocket]: any = useState<Socket | null>(null)

  // connection and disconnection
  useEffect(()=>{
    const newSocket = io('127.0.0.1:4000');
    setSocket(newSocket)
    
    newSocket.on('connect', ()=> console.log("Connected to the server"))

    return () => {
      console.log("terminating connections");
      newSocket.removeAllListeners();
      newSocket.disconnect();
    }
  }, [])

  const unsubscribe = (eventName: string) => {
    console.log("called unsub")
    socket.off(eventName, ()=>{
      console.log("unsubscribed from: ", eventName)
    })
  }

  const getConnectedUsers = () => {
    console.log("SOCKET INFO:", socket)
    console.log('asked for users!')
    socket.emit('getConnectedUsers')
  }

  const disconnectAll = () => {
    console.log('asked for total genocide!')
    socket.emit('disconnectAll')
  }


  return {io: socket, getConnectedUsers, disconnectAll, unsubscribe}
}