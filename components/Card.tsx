import React, { useState } from "react";
import { chakra, Image, Box, Flex, useColorModeValue, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
import { Modal, Button, Group } from '@mantine/core';
import { CheckIcon } from '@radix-ui/react-icons'
// Sample card from Airbnb


const abi = [
  // ERC-721
  "function proveOwnership(uint256 tokenId, uint16 secret) public"
]

export default function Card(props: any) {
  const [opened, setOpened] = useState(false);
  const [secretCode, setSecretCode] = useState("")
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
          <Button onClick={() => setOpened(true)}>View Ticket</Button>
        </Box>
      </Box>
    </Box>

    <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
       <chakra.p mb={4}>{"Token Id: " + props.tokenId}</chakra.p>
            <FormControl>
              <FormLabel>Secret Code</FormLabel>
              <Input value={secretCode} onChange={e => setSecretCode(e.target.value)} placeholder='Code' />
          </FormControl>

          <Button onClick={verifyNFT} mr={3}>
              Verify
            </Button>
            <Button onClick={() => setOpened(false)}>Cancel</Button>
      </Modal>

   
    </>
  )
}