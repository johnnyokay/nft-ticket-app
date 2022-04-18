import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useUser } from "../hooks/useUser";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  useMantineTheme,
  createStyles,
} from '@mantine/core';
import marketplaceabi from "../hooks/marketplaceABI.json"
import MarketplaceCard from "../components/MarketplaceCard";

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

var requestOptions: RequestInit = {
  method: 'POST',
  redirect: 'follow',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  },
};


const abi = [
  // ERC-721
  "function tokenURI(uint256 _tokenId) external view returns (string)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  "function fetchMarketItems() public view",
  // ERC-1155
  "function uri(uint256 _id) external view returns (string)",
]

const web3 = createAlchemyWeb3(
  `https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2`,
);

const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2")

const contractAddress = "0x4578340d62906f2F2a92844Dd6832eA035131eb7"

const marketplace = () => {
  const { classes } = useStyles();
  const { user } = useUser()
  const [nfts, setNFTs] = useState([])

  useEffect(() => {
      const getListedNFTs = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        try {
          const contract = new ethers.Contract(
            contractAddress,
            marketplaceabi,
            signer
        );

          const data = await contract.fetchMarketItems()
          const items = data.map(i => {
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
              price: i.price,
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
            }
            return item;
          })

          setNFTs(items)

          console.log("hello")
          console.log(data)
        } catch(error) {
          console.log(error.message)
        }
        
      }

      if (user.address) {
        getListedNFTs();
      }
  }, [user])

  return (
    <>
    <Navbar />
    <Container className={classes.wrapper}>
      <Title className={classes.title}>Purchase NFTs</Title>

      <Container size={560} p={0}>
        <Text size="md" className={classes.description}>
          Browse NFTs to purchase
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={3}
        spacing={30}
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'xl' },
          { maxWidth: 755, cols: 1, spacing: 'xl' },
        ]}
      >
        {nfts.map((nft: any, idx) => 
                  <MarketplaceCard tokenId={nft.tokenId} price={nft.price} walletAddress={user.address} />
              )}
      </SimpleGrid>
    </Container>
    </>
  )
}

export default marketplace