import React, { useState } from "react";
import {
	chakra,
	Image,
	Box,
	Flex,
	useColorModeValue,
	useDisclosure,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
import { Modal, Button, Group } from "@mantine/core";
import { CheckIcon } from "@radix-ui/react-icons";
import marketplaceabi from "../hooks/marketplaceABI.json";
// Sample card from Airbnb

const abi = [
	// ERC-721
	"function proveOwnership(uint256 tokenId, uint16 secret) public",
	"function listNFT(uint256 tokenId, uint256 price) external nonReentrant",
];

const marketplaceContract = "0x4578340d62906f2F2a92844Dd6832eA035131eb7";

export default function Card(props: any) {
	const notifications = useNotifications();

	const purchaseNFT = async (tokenId: number) => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		const contract = new ethers.Contract(
			marketplaceContract,
			marketplaceabi,
			signer
		);

		try {
			notifications.showNotification({
				title: "Transaction Started",
				message: "Confirm the transaction to continue",
			});

			console.log(props.price);
			const price = ethers.utils.parseUnits(
				props.price.toString(),
				"ether"
			);
			console.log(price);
			console.log(parseInt("0x3b9aca00", 16));
			const verifyTxn = await contract.purchaseNFT(
				props.walletAddress,
				tokenId,
				{ value: 1 }
			);

			const id = notifications.showNotification({
				title: "Transaction Sent",
				message: "The transaction should be confirmed shortly",
				loading: true,
				autoClose: false,
				disallowClose: true,
			});

			await verifyTxn.wait();

			setTimeout(() => {
				notifications.updateNotification(id, {
					id,
					color: "teal",
					title: "Transaction Confirmed!",
					message:
						"Notification will close in 2 seconds, you can close this notification now",
					icon: <CheckIcon />,
					autoClose: 2000,
				});
			}, 3000);
		} catch (error) {
			notifications.showNotification({
				title: "Error",
				message: error.message,
				color: "red",
			});
		}
	};

	return (
		<>
			<Box
				maxW="sm"
				shadow="md"
				borderWidth="1px"
				borderRadius="lg"
				overflow="hidden"
			>
				<Image
					src={
						"https://ipfs.io/ipfs/QmPtUx44pEg6KtorBrcjNxJYwx7S1nY7NPoCpmLUXxcBts"
					}
					alt={props.tokenId}
				/>

				<Box p="4">
					<Box
						mt="0"
						fontWeight="semibold"
						fontSize="22"
						as="h3"
						lineHeight="tight"
						isTruncated
					>
						{props.tokenId}
					</Box>
					<Box
						mt="0"
						fontWeight="semibold"
						fontSize="22"
						as="h3"
						lineHeight="tight"
						isTruncated
					>
						{props.price.toString()}
					</Box>

					<Box display="flex" mt="2" alignItems="self-end">
						<Button onClick={() => purchaseNFT(props.tokenId)}>
							Purchase Ticket
						</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
}
