import React, { useState } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Button, useDisclosure, FormControl, FormLabel, Input } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ethers } from "ethers";

// Sample card from Airbnb

const abi = [
  // ERC-721
  "function proveOwnership(uint256 tokenId, uint16 secret) public"
]

export default function Card(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [secretCode, setSecretCode] = useState("")

  const verifyNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
        props.contractAddress,
        abi,
        signer
    );

    await contract.proveOwnership(props.tokenId, secretCode)
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
          <Button onClick={onOpen}>View Ticket</Button>
        </Box>
      </Box>
    </Box>

    <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Validate NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            
            <chakra.p mb={4}>{"Token Id: " + props.tokenId}</chakra.p>
            <FormControl>
              <FormLabel>Secret Code</FormLabel>
              <Input value={secretCode} onChange={e => setSecretCode(e.target.value)} placeholder='Code' />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button onClick={verifyNFT} colorScheme='blue' mr={3}>
              Verify
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}