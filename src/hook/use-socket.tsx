import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

export default function useSocket(){
  const [socket, setSocket] = useState<Socket>(io('192.168.2.104:4000'))

  useEffect(()=>{
    newConnection()
    return () => { unsubscribe() }
  }, [socket])

  const newConnection = () => {
    socket.connect()
    console.log("connected with id:", socket.id)

    socket.on('connect', ()=> console.log("Connected to the server"))
    socket.on('connectedUsers', (data: any)=> console.log("connected users:", data))
  }

  const unsubscribe = () => {
    socket.removeAllListeners()
    socket.disconnect()
  }


  const getConnectedUsers = () => {
    console.log('asked for users!')
    socket.emit('getConnectedUsers')
  }

  const disconnectAll = () => {
    console.log('asked for total genocide!')
    socket.emit('disconnectAll')
  }

  return {io: socket, getConnectedUsers, disconnectAll}
}