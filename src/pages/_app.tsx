import useSocket from '@/hooks/use-socket'
import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getItem } from '@/lib/local-storage'
import { useAccountStore } from '@/stores/account-store'
import { useSocketStore } from '@/stores/socket-store'
import Loading from '@/components/loading/loading'
import { useLoadingStore } from '@/stores/loading-store'

export default function App({ Component, pageProps }: AppProps) {
  const {usertag, setUser}: any = useAccountStore()
  const {socket ,setSocket}: any = useSocketStore()
  const {loading, setLoading}: any = useLoadingStore()
  const router = useRouter()
  const socketHook = useSocket()

  useEffect(()=>{
    !socket && socketHook.io && setSocket(socketHook)
  }, [socketHook])

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){
      router.replace('/')
      return
    }
    !usertag && setUser(userdata)
  }, [router.pathname])

  if(loading){
    return(
      <Loading />
    )
  }

  return (
    <WarningProvider>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </WarningProvider>
  )
}

