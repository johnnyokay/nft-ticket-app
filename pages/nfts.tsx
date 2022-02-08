import { chakra, Button, Box, Image, Flex, Heading, Input, useColorMode, useColorModeValue, Grid, GridItem, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const url = "https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2"

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

const api = "HUCC73V8581MMZD9WSZN682PXJGD19B6H1"

const provider = new ethers.providers.JsonRpcProvider(url)

const abi = [
  // ERC-721
  "function tokenURI(uint256 _tokenId) external view returns (string)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  // ERC-1155
  "function uri(uint256 _id) external view returns (string)",
]

const nfts = () => {
  const { toggleColorMode } = useColorMode()
  const formBackground = useColorModeValue("gray.100", "gray.700")
  const router = useRouter()
  
  const [walletAddress, setWalletAddress] = useState("")
  const [nfts, setNFTs] = useState([])

  const validJSON = (str: string) => {
      try {
        if (str.substring(0, 29) === "data:application/json;base64,") {
          let enc = str.substring(29)
          let buff = Buffer.from(enc, 'base64')
          let decoded = buff.toString('ascii')
          JSON.parse(decoded);
        } else {

        }
      } catch (e) {
          return false;
      }
    return true;
  }

  let modifiedData: any = []
  useEffect(() => {
    // Client-side-only code
    async function initWeb3() {
      if (typeof window.ethereum !== "undefined" || (typeof window.web3 !== "undefined")) {
        const provider = new ethers.providers.Web3Provider(window.ethereum,"any");
        const signer = provider.getSigner();

        try {
          const addr = await signer.getAddress().then(async (a: string) => {
            if (addr !== null) {
              setWalletAddress(a)
        
              const erc721Data = await fetch(`https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&address=${a}&startblock=0&endblock=999999999&sort=asc&apikey=${api}`)
              const resJSON = await erc721Data.json()
              const data = resJSON["result"]

              const fetches = [];
              for (var key in data) {
                const contractAddress = data[key].contractAddress
                console.log(contractAddress)
                if (contractAddress !== "0xf0d755b10b0b1b5c96d00d84152385f9fd140739") continue;
                //0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85
                //0x85f740958906b317de6ed79663012859067e745b

                const erc721 = new ethers.Contract(contractAddress, abi, provider)

                const tokenID = data[key].tokenID
                const tokenName = data[key].tokenName

                console.log(data[key])

                
                fetches.push(
                  erc721.tokenURI(tokenID)
                    .then((res: any) => { 
                      //console.log(res)
                      return fetch(res) 
                    })
                    .then((res: any) => { return res.json() })
                    .then((res: any) => {
                      console.log(res)
                      if (res.image.substring(0, 7) === "ipfs://") {
                        res.image = `https://ipfs.io/ipfs/${res.image.substring(5)}`
                      }
                      
                      console.log(res)

                        modifiedData.push({
                          contractAddress: contractAddress,
                          tokenName: tokenName,
                          tokenID: tokenID,
                          name: res.name,
                          image: res.image
                        })
                    })
                )
              }

              await Promise.allSettled(fetches).then(() => {
                setNFTs(modifiedData)
                console.log("done")
                console.log(modifiedData)
              }).catch((err) => {
                console.log(err)
              })

            }
          })
        } catch(error) {
          console.log(error)
        }
        
      }
    }
    initWeb3();
  }, [])

  return (
    <div>
      <Navbar />
      
      <chakra.div mt="50" h="4.5rem" mx="auto" maxW="1200px">
        <Flex justifyContent="center">

      <Heading
          mb={3}
          mt={5}
          fontSize={{ base: "4xl", md: "5xl" }}
          color={useColorModeValue("gray.900", "gray.100")}
          lineHeight="shorter"
        >
          Select tickets to&nbsp;
          <Text as={'span'} color={'teal.300'}>
            validate
          </Text>
        </Heading>
        </Flex>
        <Grid mt="50" templateColumns='repeat(4, 1fr)' gap={6}>
          
          {nfts.map((nft: any, idx) => 
                  <Card name={nft.name} image={nft.image} tokenId={nft.tokenID} contractAddress={nft.contractAddress} walletAddress={walletAddress} />
              )}
        
        </Grid>
      </chakra.div>
      
        
    </div>
  )
}

export default nfts