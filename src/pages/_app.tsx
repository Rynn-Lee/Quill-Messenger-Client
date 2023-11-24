import useSocket from '@/hooks/use-socket'
import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getItem } from '@/lib/local-storage'
import { useAccountStore } from '@/stores/AccountStore'
import { useSocketStore } from '@/stores/SocketStore'

export default function App({ Component, pageProps }: AppProps) {
  const {usertag, setUser}: any = useAccountStore()
  const {socket ,setSocket}: any = useSocketStore()
  const router = useRouter()
  const socketHook = useSocket()

  useEffect(()=>{
    !socket && socketHook.io && setSocket(socketHook)
  }, [socketHook])

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){
      router.push('/')
      return
    }
    !usertag && setUser(userdata)
  }, [router.pathname])

  useEffect(()=>{
    const currentPort = window.location.port;
    console.log("Current Port:", currentPort);
  }, [])

  return (
    <WarningProvider>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </WarningProvider>
  )
}

