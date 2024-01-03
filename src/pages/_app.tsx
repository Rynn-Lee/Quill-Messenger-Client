import AppLayout from '@/layouts/app-layout'
import '@/styles/global.sass'
import type { AppProps } from 'next/app'
import WarningProvider from '@/lib/warning/warning-context'
import dynamic from 'next/dynamic';

const NonSSRWrapper = ({ children }: any) => (<>{children}</>);

const ComponentWithNoSSR = dynamic(() => Promise.resolve(NonSSRWrapper), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ComponentWithNoSSR>
      <WarningProvider>
        <AppLayout>
          <Component {...pageProps}/>
        </AppLayout>
      </WarningProvider>
    </ComponentWithNoSSR>
  )
}