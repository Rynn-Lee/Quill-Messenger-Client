import { SocketContext } from '@/components/sockets/context'
import useSocket from '@/hook/use-socket'
import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  const socketHook = useSocket()

  return (
    <SocketContext.Provider value={socketHook}>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </SocketContext.Provider>
  )
}
