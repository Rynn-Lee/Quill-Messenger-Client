import DialogList from "@/components/dialogs/dialog-list";
import SocketWrapper from "@/context/socket-context";
import Home from "@/pages";
import { useAccountStore } from "@/stores/account-store";
import Sidebar from "@components/sidebar/sidebar";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ignoreList: string[] = ["/settings", "/profile"]

export default function AppLayout({children}: {children: React.ReactNode}){
  const user = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    if(!user._id){
      router.replace('/')
      return
    }
  }, [router.pathname])

  if(!user._id || router.pathname == "/"){
    return <div className="login"> <Home /> </div>
  }
  
  return(
    <SocketWrapper _id={user._id}>
      <Sidebar /> 
      {!ignoreList.includes(router.pathname) ? <DialogList/>: <></>}
      <div className={"content"}>
        {children}
      </div>
    </SocketWrapper>
  )
}

