import { Button, chakra, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function WalletConnect() {
    const [walletAddress, setWalletAddress] = useState("")
    const [connectedNetwork, setConnectedNetwork] = useState("")

    useEffect(() => {
        // Client-side-only code
        async function initWeb3() {
          if (typeof window.ethereum !== "undefined" || (typeof window.web3 !== "undefined")) {
            const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
            const signer = provider.getSigner();
    
            try {
              const addr = await signer.getAddress().then((a: string) => {
                if (addr !== null) {
                  setWalletAddress(a)
                }
              })
              const network = await provider.getNetwork().then((n) => {
                if (network !== null) {
                  setConnectedNetwork(n.name)
                }
              })
            } catch(error) {
              console.log(error)
            }
            
          }
        }
        initWeb3();
      }, [])
    
      const connectMetamask = async () => {
        console.log("clicked")
        if (typeof window.ethereum !== "undefined" || (typeof window.web3 !== "undefined")) {
          const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner()
          try {
            const addr = await signer.getAddress().then((a: string) => {
              if (addr !== null) {
                setWalletAddress(a)
              }
            })
            const network = await provider.getNetwork().then((n) => {
              if (network !== null) {
                setConnectedNetwork(n.name)
              }
            })
          } catch(error) {
            console.log(error)
          }
        }
      }

      let buttonText;
      if (walletAddress === "") {
            buttonText = "Sign In"
      } else {
            buttonText = walletAddress.substring(0,6) + "..." + walletAddress.substring(walletAddress.length-4, walletAddress.length)
      }
      console.log(connectedNetwork)

      return (
        <chakra.div>
          <Flex direction="row" justifyContent="center" alignItems="center">
            {connectedNetwork !== "" ? 
              <chakra.p mr="5" fontWeight="light" colorScheme="teal">
              {"network: " + connectedNetwork}
            </chakra.p>
            :
            null
          }
        
          <Button colorScheme="teal" variant="outline" onClick={connectMetamask}>
            {buttonText}
        </Button>
          </Flex>
        </chakra.div>
        
      )
}