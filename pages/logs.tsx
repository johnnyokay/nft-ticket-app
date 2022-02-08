import { chakra, Button, Box, Image, Flex, Heading, Input, useColorMode, useColorModeValue, Grid, GridItem, Text, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot } from "@chakra-ui/react";
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
  "event OwnershipApprovalRequest(address ownerAddress, uint256 tokenId, uint16 secret)"
]

const nfts = () => {
  const { toggleColorMode } = useColorMode()
  const formBackground = useColorModeValue("gray.100", "gray.700")
  const router = useRouter()
  
  const [walletAddress, setWalletAddress] = useState("")
  const [events, setEvents] = useState([])

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

              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();

              const contract = new ethers.Contract(
                "0xf0d755b10b0b1b5c96d00d84152385f9fd140739",
                abi,
                signer
              );

              contract.on("OwnershipApprovalRequest", (address, tokenId, secret) => {
                console.log(`Address: ${address}, tokenId: ${tokenId}, secret: ${secret}`);
              });

              let eventFilter = contract.filters.OwnershipApprovalRequest()
              let blockNumber = await provider.getBlockNumber()
              let events: any = await contract.queryFilter(eventFilter, blockNumber-3000, blockNumber)

              console.log(events)
              setEvents(events)
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
          View ticket&nbsp;
          <Text as={'span'} color={'teal.300'}>
            logs
          </Text>
        </Heading>
        </Flex>
        <Table mt="50" variant='simple'>
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Token Id</Th>
              <Th >Secret Code</Th>
            </Tr>
          </Thead>
          <Tbody>
          {events.map((nft: any, idx) => 
              <Tr>
                <Td>{nft.args.ownerAddress}</Td>
                <Td>{nft.args.tokenId._hex}</Td>
                <Td>{nft.args.secret}</Td>
              </Tr>  
          )}

          </Tbody>
        </Table>
      </chakra.div>
        
    </div>
  )
}

export default nfts