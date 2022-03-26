import { Button, chakra, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";


export default function WalletConnect() {
    const { user, connectWeb3Modal } = useUser()

      let buttonText
      let networkText = user.network
      let address = user.address
      if (address === "") {
            buttonText = "Sign In"
      } else {
            buttonText = address.substring(0,6) + "..." + address.substring(address.length-4, address.length)
      }
      
      // if (user.network !== "maticmum") {
      //   networkText = "Unsupported Network"
      // }

      return (
        <chakra.div>
          <Flex direction="row" justifyContent="center" alignItems="center">
            {user.network !== "" ? 
              <chakra.p mr="5" fontWeight="light" colorScheme="teal">
              {"network: " + networkText}
            </chakra.p>
            :
            null
          }
        
          <Button colorScheme="teal" variant="outline" onClick={connectWeb3Modal}>
            {buttonText}
        </Button>
          </Flex>
        </chakra.div>
        
      )
}