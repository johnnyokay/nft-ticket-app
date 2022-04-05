import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useUser } from "../hooks/useUser";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useNotifications } from "@mantine/notifications";

import { CheckIcon } from '@radix-ui/react-icons'
import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  useMantineTheme,
  createStyles,
  TextInput,
  Textarea,
  Group,
  Button,
  Paper,
  Box,
  Image
} from '@mantine/core';
import { flexbox } from "@chakra-ui/react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: 0,
    paddingBottom: 0,
  },

  Box: {
    border: '1px solid gray'
  },

  rightBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },

  // title: {
  //   fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  //   fontWeight: 900,
  //   marginBottom: theme.spacing.md,
  //   textAlign: 'center',

  //   [theme.fn.smallerThan('sm')]: {
  //     fontSize: 28,
  //     textAlign: 'left',
  //   },
  // },

  title: {
    color: 'black'
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('sm')]: {
      textAlign: 'left',
    },
  },
}));

var requestOptions: RequestInit = {
  method: 'POST',
  redirect: 'follow',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  },
};

const baseURL = "https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2"

const contractAddr = "0xf0d755b10b0b1b5c96d00d84152385f9fd140739";

const abi = [
  // ERC-721
  "function tokenURI(uint256 _tokenId) external view returns (string)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  "function safeMint(address to)",
  // ERC-1155
  "function uri(uint256 _id) external view returns (string)",
]

const web3 = createAlchemyWeb3(
  `https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2`,
);

const contractAddress = "0xf0d755b10b0b1b5c96d00d84152385f9fd140739"

const buytickets = () => {
  const { user } = useUser();
  const { classes } = useStyles();
  const [nfts, setNFTs] = useState([])
  const notifications = useNotifications()

  const purchaseNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
    );

    try {
      notifications.showNotification({
        title: 'Transaction Started',
        message: 'Confirm the transaction to continue',
      })
  
      console.log(user.address)
      const verifyTxn = await contract.safeMint(user.address)
  
      const id = notifications.showNotification({
        title: 'Transaction Sent',
        message: 'The transaction should be confirmed shortly',
        loading: true,
        autoClose: false,
        disallowClose: true
      })
  
      await verifyTxn.wait()
  
      setTimeout(() => {
        notifications.updateNotification(id, {
          id,
          color: 'teal',
          title: 'Transaction Confirmed!',
          message:
            'Notification will close in 2 seconds, you can close this notification now',
          icon: <CheckIcon />,
          autoClose: 2000,
        });
      }, 3000);
    } catch (error) {
      notifications.showNotification({
        title: 'Error',
        message: error.message,
        color: 'red'
      })
    }

    
  }

  return (
    <>
    <Navbar />
    <Container size="lg">

    
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: 755, cols: 1 }]}>
      <Box
        className={classes.Box}
        sx={(theme) => ({
          borderRadius: theme.radius.md,
          backgroundColor: theme.white,
        })}
      >
        <Image
          radius="md"
          src="https://ipfs.io/ipfs/QmPtUx44pEg6KtorBrcjNxJYwx7S1nY7NPoCpmLUXxcBts"
        />
      </Box>

      
      <Box
        sx={(theme) => ({
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column'
        })}
      >
       <Title ml="xl" order={1} color="white" className={classes.title}>
            Event X Ticket
        </Title>     
        <Button onClick={() => purchaseNFT()} size="xl">
          Purchase Ticket
        </Button>
        
      </Box>
    </SimpleGrid>
    </Container>
    </>
  )
}

export default buytickets