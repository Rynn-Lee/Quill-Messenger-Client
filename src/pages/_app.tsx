import SocketProvider from '@/lib/socket-context'
import useSocket from '@/hooks/use-socket'
import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getItem } from '@/lib/local-storage'
import { useAccountStore } from '@/stores/AccountStore'


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const socketHook = useSocket()
  const {usertag, setUser}: any = useAccountStore()

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){
      router.push('/')
      return
    }
    !usertag && setUser(userdata)
  }, [router.pathname])

  return (
    <SocketProvider socket={socketHook}>
      <WarningProvider>
        <AppLayout>
          <Component {...pageProps}/>
        </AppLayout>
      </WarningProvider>
    </SocketProvider>
  )
}
