import Icon from "@/assets/Icons"
import Message from "./message/message"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../sockets/context"
import styles from './chat-list.module.sass'
import { Socket } from "socket.io-client"

export default function ChatList(){
  const [users, setUsers] = useState([])
  const socket: any = useContext(SocketContext)

  useEffect(()=>{
    socket.io.on('connectedUsers', (data: any)=>setUsers(data))
  }, [])

  return(
    <>
    <div className={styles.title}>
      <div onClick={()=>socket.disconnectAll()}><Icon.Chat/><b>Direct Messages</b></div>
      <div onClick={()=>socket.getConnectedUsers()}><Icon.Friends/></div>
    </div>
    <div className={styles.chatList}>
      {users?.map((user: any) => (
        <Message key={user} name={user}/>
      ))}
    </div>
    </>
  )
}