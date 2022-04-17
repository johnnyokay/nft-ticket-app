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

const baseURL = "https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2"

const contractAddr = "0xf0d755b10b0b1b5c96d00d84152385f9fd140739";

const abi = [
  // ERC-721
  "function tokenURI(uint256 _tokenId) external view returns (string)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  // ERC-1155
  "function uri(uint256 _id) external view returns (string)",
]

const web3 = createAlchemyWeb3(
  `https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2`,
);

const contractAddress = "0xf0d755b10b0b1b5c96d00d84152385f9fd140739"

const mytickets = () => {
  const { classes } = useStyles();
  const { user } = useUser()
  const [nfts, setNFTs] = useState([])

  useEffect(() => {
      const getNFTs = async() => {
          const nfts = await web3.alchemy.getNfts({
            owner: user.address,
            contractAddresses: [ contractAddress ],
            withMetadata: true
          })
          
          let modifiedData: any = []
          for (const nft of nfts.ownedNfts) {
            const tokenID = parseInt(nft.id.tokenId, 16)
            const image = `https://ipfs.io/ipfs/${nft.metadata?.image?.substring(5)}`

            modifiedData.push({
              contractAddress: contractAddress,
              tokenID: tokenID,
              name: nft.metadata?.name,
              image: image,
            })
          }

          setNFTs(modifiedData)
      }

      if (user.address) {
        getNFTs();
      }
  }, [user])

  return (
    <>
    <Navbar />
    <Container className={classes.wrapper}>
      <Title className={classes.title}>My Tickets</Title>

      <Container size={560} p={0}>
        <Text size="md" className={classes.description}>
          Click a ticket to scan it for entry
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
                  <Card name={nft.name} image={nft.image} tokenId={nft.tokenID} contractAddress={nft.contractAddress} walletAddress={user.address} />
              )}
      </SimpleGrid>
    </Container>
    </>
  )
}

export default mytickets