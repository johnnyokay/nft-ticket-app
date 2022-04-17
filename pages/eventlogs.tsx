import { chakra, Button, Box, Image, Flex, Heading, Input, useColorMode, useColorModeValue, Grid, GridItem, Text, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Container } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { createStyles, Title } from "@mantine/core";
import { useUser } from "../hooks/useUser";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      textAlign: 'left',
    },
  },
}));

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
  const { classes } = useStyles()
  const { toggleColorMode } = useColorMode()
  const formBackground = useColorModeValue("gray.100", "gray.700")
  const router = useRouter()
  
  const [walletAddress, setWalletAddress] = useState("")
  const [events, setEvents] = useState([])
  const { user } = useUser()

  useEffect(() => {
    const getEventLogs = async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        user.address,
        abi,
        signer
      );

      contract.on("OwnershipApprovalRequest", (address, tokenId, secret) => {
        console.log(`Address: ${address}, tokenId: ${tokenId}, secret: ${secret}`);
      });

      let eventFilter = contract.filters.OwnershipApprovalRequest()
      let blockNumber = await provider.getBlockNumber()
      let events: any = await contract.queryFilter(eventFilter, blockNumber-3000, blockNumber)

      setEvents(events)
    }

    if (user.address) {
      getEventLogs();
    }
  }, [])

  return (
    <div>
      <Navbar />
      <chakra.div mt="50" h="4.5rem" mx="auto" maxW="1200px">

        <Title className={classes.title}>Event Logs</Title>

        <Container size={560} p={0}>
          <Text size="md" className={classes.description}>
          </Text>
        </Container>
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