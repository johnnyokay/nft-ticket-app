import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers"
import Web3Modal from "web3modal"

type User = {
    address: string
    network: string
}

type Props = {
    children: any
}

type ContextType = {
    user: User
    connectWeb3Modal?: () => void
}

const defaultState = {
    user: {} as User
}

const UserContext = createContext<ContextType>(defaultState)

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User>({
        address: "",
        network: ""
    })

    console.log(user.network)

    useEffect(() => {
        //detect if already connected
        const initWeb3 = async () => {
            try {
                if (typeof window.ethereum !== "undefined" ) { 
                    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                    const addresses = await provider.listAccounts()
                    if (addresses.length) {
                        updateUser(provider)
                    }
                }
            } catch (error) {
                console.log("no account detected")
            }
        }

        initWeb3()
    }, [])

    //open web3 modal
    const connectWeb3Modal = async () => {
        if (user.address === "") {
            const providerOptions = {
                /* See Provider Options Section */
            }
    
            const web3Modal = new Web3Modal({
                network: "mainnet", // optional
                cacheProvider: true, // optional
                providerOptions // required
            })
    
            const instance = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(instance)
            updateUser(provider)
        }
    }

    //update user state
    const updateUser = async (provider: ethers.providers.Web3Provider) => {
        console.log("YEEE")
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const network = await provider.getNetwork()
        setUser({
            address: address,
            network: network.name
        })

        provider.on("error", (tx) => {
            console.log("error")
        });

        window.ethereum.on("chainChanged", async (chainId: number) => {
            const network = await provider.getNetwork()
            setUser({
                address: address,
                network: network.name
            })
        });

        // // Subscribe to chainId change
        // provider.on("network", (network, oldNetwork) => {
        //     setUser({
        //         address: address,
        //         network: network.name
        //     })
        // });
        // Subscribe to provider connection
        provider.on("connect", (info: { chainId: number }) => {
             console.log("connected omg")
            console.log(info);
        })
        
        // Subscribe to provider disconnection
        window.ethereum.on("accountsChanged", (error: { code: number; message: string }) => {
            console.log("hu")
        
        })
    }

    return (
        <UserContext.Provider value={{ user, connectWeb3Modal }}>
          {children}
        </UserContext.Provider>
      );
}

export const useUser = () => useContext(UserContext)