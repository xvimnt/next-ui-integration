import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import '../styles/globals.css'

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  useEffect(()=> {
    localStorage.setItem('accessToken', 'EAAKVNbIy5ycBAPwCIhJktwdUu21PQZA4KqMFMgMwsSzjvTTpG3KT4PT4dfZAGPwkLNCxOmuVSwtby6oXZAcEUGyZAzPY3SMIDZA1uu4C5VokWeCPENXKULOn4gQ2ZBDZB5dTWHhpjOoIS3tTjUN9RmGsjRdgmK8go4XzNQfeuVjVtjZCRVYNGZCFM6EnjrZBmi3CZAaoCjDN1zVUQZDZD')
  }, [])
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
    </SessionProvider>
  )
}