import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { NotificationsProvider } from '@mantine/notifications';
import { UserProvider } from '../hooks/useUser'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <NotificationsProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </NotificationsProvider>
    </ChakraProvider>
  )
}

export default MyApp
