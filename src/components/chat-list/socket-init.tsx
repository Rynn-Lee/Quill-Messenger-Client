import useSocket from "@/hooks/use-socket"
import { useAccountStore } from "@/stores/account-store"
import { useSocketStore } from "@/stores/socket-store"
import { useEffect } from "react"

export default function SocketInit(){
  const {_id, usertag}: any = useAccountStore()
  const socketHook: any = useSocket(_id, usertag)
  const {socket, setSocket}: any = useSocketStore()

  useEffect(()=>{
    !socket && socketHook.io && setSocket(socketHook)
  }, [socketHook])

  return(<></>)
}