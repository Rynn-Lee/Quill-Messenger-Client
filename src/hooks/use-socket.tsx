import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"

export default function useSocket(){
  const [socket, setSocket] = useState<Socket>(io('127.0.0.1:4000'))

  // unsubscribe
  useEffect(()=>{
    return () => terminateConnection() 
  }, [])

  // subscriptions
  socket.on('connect', ()=> console.log("Connected to the server"))

  // exported functions
  const terminateConnection = () => {
    console.log("terminating connections")
    socket.removeAllListeners()
    socket.disconnect()
  }

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