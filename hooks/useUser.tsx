import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal, { ChainDataList } from "web3modal";
import WalletLink from "walletlink";
import WalletConnect from "@walletconnect/web3-provider";
import { Web3Provider } from "walletlink/dist/provider/Web3Provider";
import { Provider } from "@ethersproject/abstract-provider";

type User = {
	address: string;
	displayName: string;
	network: string;
};

type Props = {
	children: any;
};

type ContextType = {
	user: User;
	connectWeb3Modal?: () => void;
	switchNetwork?: () => void;
};

const defaultState = {
	user: {} as User,
};

const UserContext = createContext<ContextType>(defaultState);

const providerOptions = {
	metamask: {
		package: true,
	},
	walletlink: {
		package: WalletLink,
		options: {
			appName: "Web 3 Modal Demo",
			infuraId: "386757c0bda943e0857d1bf50bec79f8",
			rpc: "",
			chainId: 4,
		},
	},
	walletconnect: {
		package: WalletConnect,
		options: {
			infuraId: "386757c0bda943e0857d1bf50bec79f8",
		},
	},
};

export const UserProvider = ({ children }: Props, { chains }: any) => {
	console.log(chains);
	const [user, setUser] = useState<User>({
		address: "",
		displayName: "",
		network: "",
	});

	const [provider, setProvider] = useState<Provider>();

	useEffect(() => {
		//detect if already connected
		const initWeb3 = async () => {
			try {
				if (
					typeof window !== "undefined" &&
					typeof window.ethereum !== "undefined"
				) {
					const web3Modal = new Web3Modal({
						cacheProvider: true, // optional
						disableInjectedProvider: false,
						providerOptions, // required
					});

					//await web3Modal.clearCachedProvider()

					const provider: any = await web3Modal.connect();
					const lib: any = new ethers.providers.Web3Provider(
						window.ethereum,
						"any"
					);
					const addresses = await lib.listAccounts();
					if (addresses) {
						console.log("3333");
						updateUser(lib);
						setProvider(provider);
					}
				}
			} catch (error) {
				console.log(error);
				console.log("no account detected");
			}
		};
		initWeb3();
	}, []);

	useEffect(() => {
		if (provider?.on) {
			const handleAccountsChanged = (accounts: any) => {
				console.log("accountsChanged", accounts);
				const lib: any = new ethers.providers.Web3Provider(
					window.ethereum,
					"any"
				);
				console.log("11111");
				if (accounts) updateUser(lib);
			};

			const handleChainChanged = async (chainIdHex: string) => {
				const lib = new ethers.providers.Web3Provider(
					window.ethereum,
					"any"
				);
				console.log("22222");
				updateUser(lib);
			};

			const handleDisconnect = () => {
				console.log("disconnect");
				disconnect();
			};

			provider.on("accountsChanged", handleAccountsChanged);
			provider.on("chainChanged", handleChainChanged);
			provider.on("disconnect", handleDisconnect);

			return () => {
				if (provider.removeListener) {
					provider.removeListener(
						"accountsChanged",
						handleAccountsChanged
					);
					provider.removeListener("chainChanged", handleChainChanged);
					provider.removeListener("disconnect", handleDisconnect);
				}
			};
		}
	}, [provider]);

	const connectWeb3Modal = async () => {
		try {
			const web3Modal = new Web3Modal({
				cacheProvider: true, // optional
				disableInjectedProvider: false,
				providerOptions, // required
			});

			const provider: any = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			setProvider(provider);
			updateUser(library);
		} catch (error) {
			console.error(error);
		}
	};

	const switchNetwork = async () => {
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x13881" }],
			});
		} catch (err) {
			if (err.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainName: "Mumbai",
								chainId: "0x13881",
								nativeCurrency: {
									name: "MATIC",
									decimals: 18,
									symbol: "MATIC",
								},
								rpcUrls: [
									"https://matic-mumbai.chainstacklabs.com",
									"https://rpc-mumbai.maticvigil.com",
									"https://matic-testnet-archive-rpc.bwarelabs.com",
								],
								blockExplorerUrls: [
									{
										name: "polygonscan",
										url: "https://mumbai.polygonscan.com",
										standard: "EIP3091",
									},
								],
							},
						],
					});
				} catch (error) {
					console.log(error.message);
				}
			}
		}
	};

	const resolveEns = async (
		provider: ethers.providers.Web3Provider,
		address: string
	) => {
		let ens;
		try {
			ens = await provider.lookupAddress(address);
		} catch (error) {
			ens = null;
			console.log(error);
		}
		return ens;
	};

	//update user state
	const updateUser = async (provider: ethers.providers.Web3Provider) => {
		console.log("updateing user...");
		const signer = provider.getSigner();
		let address = await signer.getAddress();
		let ens = await resolveEns(provider, address);

		let displayName;
		if (ens) {
			displayName = ens;
		} else {
			displayName =
				address.substring(0, 6) +
				"..." +
				address.substring(address.length - 4, address.length);
		}

		let network = await provider.getNetwork();
		console.log("network : " + network.name);

		setUser({
			address: address,
			displayName: displayName,
			network: network.name,
		});
	};

	const refreshState = () => {
		setUser({
			address: "",
			displayName: "",
			network: "",
		});
	};

	const disconnect = async () => {
		const web3Modal = new Web3Modal({
			//network: "mainnet", // optional
			cacheProvider: false, // optional
			disableInjectedProvider: false,
			providerOptions, // required
		});

		await web3Modal.clearCachedProvider();
		refreshState();
	};

	return (
		<UserContext.Provider value={{ user, connectWeb3Modal, switchNetwork }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
