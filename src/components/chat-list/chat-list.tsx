import Icon from "@/assets/Icons"
import Message from "./message/message"
import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../lib/socket-context"
import styles from './chat-list.module.sass'

export default function ChatList(){
  const [users, setUsers] = useState([])
  const socket: any = useContext(SocketContext)

  useEffect(()=>{
    if(!socket){return}
    socket?.io?.on('connectedUsers', (data: any)=>setUsers(data))
    return ()=>{
      socket?.io?.off('connectedUsers')
    }
  }, [socket])

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