import { createContext, useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"
import Loading from "@/components/loading/loading";
import { useRouter } from "next/router";

export const SocketContext: any = createContext(null)

export default function SocketWrapper({children, _id}: any){
  const[socket, setSocket] = useState<Socket | null | any>()
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


  return(
    <SocketContext.Provider value={socket}>
      {!socket?.connected && router.pathname != "/"? <Loading/> : <></>}
      {children}
    </SocketContext.Provider>
  )
}