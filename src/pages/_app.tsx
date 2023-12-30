import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getItem } from '@/lib/local-storage'
import { useAccountStore } from '@/stores/account-store'

export default function App({ Component, pageProps }: AppProps) {
  const {usertag, setUser}: any = useAccountStore()
  const router = useRouter()

  useEffect(()=>{
    const userdata = getItem('userdata')
    if(!userdata){
      router.replace('/')
      return
    }
    !usertag && setUser(userdata)
  }, [router.pathname])

  return (
    <WarningProvider>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </WarningProvider>
  )
}

