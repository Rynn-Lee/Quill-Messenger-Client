import { WarningContext } from "@/lib/warning/warning-context";
import { useSocketStore } from "@/stores/SocketStore";
import Sidebar from "@components/sidebar/sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export default function AppLayout({children}: any){
  const {socket, status}: any = useSocketStore()
  const warning: any = useContext(WarningContext)
  const router = useRouter()

  useEffect(()=>{
    if(!socket?.io){return}
    !status && warning.showWindow({
      title: "Cannot connect to the server!",
      message: "You've lost a connection to the server. Check your ethernet connection"
    })
    status && warning.error.title == "Cannot connect to the server!" && warning.closeWindow()
  }, [status])

  return(
    <>
      <Head>
        <title>Quill Messenger</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {router.pathname != "/" ? <Sidebar /> : <></>}
      <div className={`${router.pathname != "/" ? "content" : "login"}`}>
        {children}
      </div>
    </>
  )
}