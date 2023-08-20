import Navbar from '@/components/Navbar'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
    <div className='main'>
      <div className='gradient' />
    </div>
    <Navbar />
    <main className='app'><Component {...pageProps} /></main>
    
    </>
  )
}
