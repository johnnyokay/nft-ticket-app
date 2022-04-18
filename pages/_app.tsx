import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { UserProvider } from "../hooks/useUser";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				/** Put your mantine theme override here */
				colorScheme: "light",
			}}
		>
			<NotificationsProvider>
				<UserProvider>
					<Component {...pageProps} />
				</UserProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
}

export default MyApp;
