import '../src/styles/global.css'
import '../src/styles/chat.css'
import dynamic from 'next/dynamic'
import App from '../src/App'

const ChatButton = dynamic(() => import('../src/components/ChatButton'), { ssr: false })

export default function MyApp({ Component, pageProps }) {
  return (
    <App>
      <Component {...pageProps} />
      <ChatButton />
    </App>
  )
}
