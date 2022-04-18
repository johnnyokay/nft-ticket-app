import React, { useState } from "react";
import { chakra, Image, Box, Flex, useColorModeValue, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
import { Modal, Button, Group } from '@mantine/core';
import { CheckIcon } from '@radix-ui/react-icons'
// Sample card from Airbnb


const abi = [
  // ERC-721
  "function proveOwnership(uint256 tokenId, uint16 secret) public",
  "function listNFT(uint256 tokenId, uint256 price) external nonReentrant"
]

const marketplaceContract = "0x4578340d62906f2F2a92844Dd6832eA035131eb7"

export default function Card(props: any) {
  const [verifyModalOpened, setVerifyModalOpened] = useState(false);
  const [listModalOpened, setListModalOpened] = useState(false);
  const [secretCode, setSecretCode] = useState("")
  const [listPrice, setListPrice] = useState("")
  const notifications = useNotifications()

  const verifyNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
        props.contractAddress,
        abi,
        signer
    );

    try {
      notifications.showNotification({
        title: 'Transaction Started',
        message: 'Confirm the transaction to continue',
      })
  
      const verifyTxn = await contract.proveOwnership(props.tokenId, secretCode)
  
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

  const listNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
        marketplaceContract,
        abi,
        signer
    );

    try {
      notifications.showNotification({
        title: 'Transaction Started',
        message: 'Confirm the transaction to continue',
      })

      const price = ethers.utils.parseUnits(listPrice, 'ether') 
  
      const verifyTxn = await contract.listNFT(props.tokenId, 1)
  
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
    <Box maxW='sm' shadow="md" borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Image src={props.image} alt={props.name} />

      <Box p='4'>
        

        <Box
          mt='0'
          fontWeight='semibold'
          fontSize="22"
          as='h3'
          lineHeight='tight'
          isTruncated
        >
          {props.name}
        </Box>

        

        <Box display='flex' mt='2' alignItems="self-end">
          <Button onClick={() => setVerifyModalOpened(true)}>View Ticket</Button>
          <Button ml={15} onClick={() => setListModalOpened(true)}>Sell Ticket</Button>
        </Box>
      </Box>
    </Box>

    <Modal
        opened={verifyModalOpened}
        onClose={() => setVerifyModalOpened(false)}
        title="Verify NFT"
      >
       <chakra.p mb={4}>{"Token Id: " + props.tokenId}</chakra.p>
            <FormControl>
              <FormLabel>Secret Code</FormLabel>
              <Input value={secretCode} onChange={e => setSecretCode(e.target.value)} placeholder='Code' />
          </FormControl>

          <Button onClick={verifyNFT} mr={3} mt={10}>
              Verify
            </Button>
            <Button onClick={() => setVerifyModalOpened(false)}>Cancel</Button>
      </Modal>

      <Modal
        opened={listModalOpened}
        onClose={() => setListModalOpened(false)}
        title="List ticket for Sale"
      >
       <chakra.p mb={4}>{"Token Id: " + props.tokenId}</chakra.p>
            <FormControl>
              <FormLabel>Sell Price</FormLabel>
              <Input value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder='Price in MATIC' />
          </FormControl>

          <Button onClick={listNFT} mr={3} mt={10}>
              List
            </Button>
            <Button onClick={() => setListModalOpened(false)}>Cancel</Button>
      </Modal>

   
    </>
  )
}