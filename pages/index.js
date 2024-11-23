import Head from 'next/head'
import Degen from '@components/Degen'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <Head>
        <title>What if... Solana</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-1 w-full mt-[-5rem]">
        <Degen />
      </main>
    </div>
  )
}
