import React, { useState } from "react";
import { ethers } from "ethers";
import { useNotifications } from "@mantine/notifications";
import {
	Modal,
	Button,
	Group,
	Card,
	Image,
	Text,
	TextInput,
} from "@mantine/core";
import { CheckIcon } from "@radix-ui/react-icons";
// Sample card from Airbnb

const abi = [
	// ERC-721
	"function proveOwnership(uint256 tokenId, uint16 secret) public",
	"function listNFT(uint256 tokenId, uint256 price) external nonReentrant",
];

const marketplaceContract = "0x4578340d62906f2F2a92844Dd6832eA035131eb7";

export default function TicketCard(props: any) {
	const [verifyModalOpened, setVerifyModalOpened] = useState(false);
	const [listModalOpened, setListModalOpened] = useState(false);
	const [secretCode, setSecretCode] = useState("");
	const [listPrice, setListPrice] = useState("");
	const notifications = useNotifications();

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
				title: "Transaction Started",
				message: "Confirm the transaction to continue",
			});

			const verifyTxn = await contract.proveOwnership(
				props.tokenId,
				secretCode
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

	const listNFT = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		const contract = new ethers.Contract(marketplaceContract, abi, signer);

		try {
			notifications.showNotification({
				title: "Transaction Started",
				message: "Confirm the transaction to continue",
			});

			const price = ethers.utils.parseUnits(listPrice, "ether");

			const verifyTxn = await contract.listNFT(props.tokenId, 1);

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
					<Image src={props.image} />
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
						{props.name}
					</Text>
				</Card.Section>

				<Group mt="s" grow={true}>
					<Button
						onClick={() => setVerifyModalOpened(true)}
						variant="filled"
						color="blue"
						style={{ marginTop: 14 }}
					>
						Verify Ticket
					</Button>

					<Button
						onClick={() => setListModalOpened(true)}
						variant="outline"
						color="blue"
						style={{ marginTop: 14 }}
					>
						List Ticket
					</Button>
				</Group>
			</Card>

			<Modal
				centered
				opened={verifyModalOpened}
				onClose={() => setVerifyModalOpened(false)}
				title="Verify NFT"
			>
				<Group>
					<TextInput
						label="Secret Code"
						value={secretCode}
						onChange={(e) => setSecretCode(e.target.value)}
					/>
				</Group>

				<Group mt={10}>
					<Button onClick={verifyNFT}>Verify</Button>
					<Button onClick={() => setVerifyModalOpened(false)}>
						Cancel
					</Button>
				</Group>
			</Modal>

			<Modal
				centered
				opened={listModalOpened}
				onClose={() => setListModalOpened(false)}
				title="List ticket for Sale"
			>
				<Group>
					<TextInput
						label="List Price (MATIC)"
						value={listPrice}
						onChange={(e) => setListPrice(e.target.value)}
					/>
				</Group>

				<Group mt={10}>
					<Button onClick={listNFT}>List</Button>
					<Button onClick={() => setListModalOpened(false)}>
						Cancel
					</Button>
				</Group>
			</Modal>
		</>
	);
}
