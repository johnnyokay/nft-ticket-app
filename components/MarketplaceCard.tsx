import React, { useState } from "react";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
import { CheckIcon } from "@radix-ui/react-icons";
import marketplaceabi from "../hooks/marketplaceABI.json";
import {
	Modal,
	Button,
	Group,
	Card,
	Image,
	Text,
	TextInput,
	Divider,
} from "@mantine/core";
import maticLogo from "../utils/polylogo.png";
// Sample card from Airbnb

const abi = [
	// ERC-721
	"function proveOwnership(uint256 tokenId, uint16 secret) public",
	"function listNFT(uint256 tokenId, uint256 price) external nonReentrant",
];

const marketplaceContract = "0x4578340d62906f2F2a92844Dd6832eA035131eb7";

export default function MarketplaceCard(props: any) {
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
				{ value: props.price }
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
			<Card withBorder radius="md" shadow="sm">
				<Card.Section>
					<Text
						size="xs"
						color="gray"
						style={{
							margin: 10,
						}}
					>
						Seller: {props.seller}
					</Text>
				</Card.Section>

				<Card.Section>
					<Image
						src={
							"https://ipfs.io/ipfs/QmPtUx44pEg6KtorBrcjNxJYwx7S1nY7NPoCpmLUXxcBts"
						}
						alt={props.tokenId}
					/>
				</Card.Section>

				<Card.Section>
					<Text
						size="xl"
						weight={500}
						style={{
							marginLeft: 15,
							marginTop: 10,
						}}
					>
						NFT Ticket #{props.tokenId}
					</Text>
				</Card.Section>

				<Divider my="md" />

				<Group mt={10} grow={true}>
					<Group>
						<Image></Image>
						<Text size="lg">{props.price.toString()} MATIC</Text>
					</Group>
					<Button
						onClick={() => purchaseNFT(props.itemId)}
						variant="filled"
						color="blue"
						fullWidth
					>
						Purchase
					</Button>
				</Group>
			</Card>
		</>
	);
}
