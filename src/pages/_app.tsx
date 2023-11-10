import SocketProvider from '@/lib/socket-context'
import useSocket from '@/hooks/use-socket'
import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  const socketHook = useSocket()

  return (
    <SocketProvider socket={socketHook}>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </SocketProvider>
  )
}
