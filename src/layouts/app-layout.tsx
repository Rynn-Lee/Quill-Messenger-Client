import DialogList from "@/components/dialogs/dialog-list";
import SocketWrapper from "@/context/socket-context";
import { getItem } from "@/lib/local-storage";
import Home from "@/pages";
import { useAccountStore } from "@/stores/account-store";
import { userData } from "@/types/types";
import Sidebar from "@components/sidebar/sidebar";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ignoreList: string[] = ["/settings", "/profile"]

export default function AppLayout({children}: {children: React.ReactNode}){
  const user = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    const userdata: userData = getItem('userdata')
    if(!userdata){
      router.replace('/')
      return
    }
    !user.usertag && user.setUser(userdata)
  }, [router.pathname])

  if(!user._id){
    return <div className="login"> <Home /> </div>
  }
  else{
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
}

