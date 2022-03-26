import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { UserProvider } from '../hooks/useUser'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  )
}

export default MyApp
