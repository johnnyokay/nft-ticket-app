import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const abi = [
  // ERC-721
  "function tokenURI(uint256 _tokenId) external view returns (string)",
  "function ownerOf(uint256 _tokenId) external view returns (address)",
  // ERC-1155
  "function uri(uint256 _id) external view returns (string)",
  "event OwnershipApprovalRequest(address ownerAddress, uint256 tokenId, uint16 secret)",
  "function safeMint(address to) public onlyOwner"
]

export default function Hero() {
  const router = useRouter()

  const [walletAddress, setWalletAddress] = useState("")

  const mintNft = async () => {
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();

    // const contract = new ethers.Contract(
    //     "0xf0d755b10b0b1b5c96d00d84152385f9fd140739",
    //     abi,
    //     signer
    // );

    // await contract.safeMint(walletAddress)
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Buy event tickets <br />
            <Text as={'span'} color={'teal.300'}>
              using crypto
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Utilise NFT technology powered by the blockchain to buy tickets and attend your favourite events
          </Text>
          <Stack
            direction={'row'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'teal'}
              bg={'teal.400'}
              px={6}
              onClick={mintNft}
              _hover={{
                bg: 'teal.600',
              }}>
              Buy Ticket
            </Button>
            <Button
              colorScheme={'teal'}
              bg={'teal.400'}
              px={6}
              onClick={() => router.push('/nfts')}
              _hover={{
                bg: 'teal.600',
                fontVariant: 'ghost'
              }}>
              Scan Tickets
            </Button>
            <Button
              colorScheme={'teal'}
              bg={'teal.400'}
              px={6}
              onClick={() => router.push('/logs')}
              _hover={{
                bg: 'teal.600',
                fontVariant: 'ghost'
              }}>
              View Ticket Logs
            </Button>
            {/* <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
              Learn more
            </Button> */}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}