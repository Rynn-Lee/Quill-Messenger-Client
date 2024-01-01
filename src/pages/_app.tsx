import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WarningProvider>
      <AppLayout>
        <Component {...pageProps}/>
      </AppLayout>
    </WarningProvider>
  )
}

