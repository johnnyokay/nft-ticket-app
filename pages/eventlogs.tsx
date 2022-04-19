import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import {
	ActionIcon,
	Button,
	Container,
	createStyles,
	Group,
	Table,
	Title,
} from "@mantine/core";
import { useUser } from "../hooks/useUser";
import { Check, AlertCircle, Ban } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
	wrapper: {
		paddingTop: 0,
		paddingBottom: 0,
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontWeight: 900,
		marginBottom: theme.spacing.md,
		textAlign: "center",

		[theme.fn.smallerThan("sm")]: {
			fontSize: 28,
			textAlign: "left",
		},
	},

	description: {
		textAlign: "center",

		[theme.fn.smallerThan("sm")]: {
			textAlign: "left",
		},
	},
}));

const url =
	"https://polygon-mumbai.g.alchemy.com/v2/9JVEvfELVUoW5aucKY_yWaRzZjfWsiA2";

var requestOptions = {
	method: "GET",
	redirect: "follow",
};

const api = "HUCC73V8581MMZD9WSZN682PXJGD19B6H1";

const provider = new ethers.providers.JsonRpcProvider(url);

const abi = [
	// ERC-721
	"function tokenURI(uint256 _tokenId) external view returns (string)",
	"function ownerOf(uint256 _tokenId) external view returns (address)",
	// ERC-1155
	"function uri(uint256 _id) external view returns (string)",
	"event OwnershipApprovalRequest(address ownerAddress, uint256 tokenId, uint16 secret)",
];

const contractAddress = "0xcAa7Cfdd22C401Db2adDAE7dC7a7CbD7fb84B260";

enum Verified {
	NotChecked,
	Verified,
	Invalid,
}

type verifiedInterface = {
	[key in Verified]: string;
};

const verifiedColors: verifiedInterface = {
	[Verified.Verified]: "rgba(17, 255, 0, 0.3)",
	[Verified.Invalid]: "rgba(255, 0, 0, 0.3)",
	[Verified.NotChecked]: "",
};

type Event = {
	ownerAddress: string;
	tokenId: number;
	secret: number;
	verified: Verified;
};

const nfts = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const [walletAddress, setWalletAddress] = useState("");
	const [events, setEvents] = useState<Event[]>([]);
	const { user } = useUser();

	useEffect(() => {
		let contract: ethers.Contract;

		const getEventLogs = async () => {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			contract = new ethers.Contract(contractAddress, abi, signer);

			let eventFilter = contract.filters.OwnershipApprovalRequest();
			let blockNumber = await provider.getBlockNumber();
			let data: any = await contract.queryFilter(
				eventFilter,
				blockNumber - 3000,
				blockNumber
			);

			const events = data.map((i: any) => {
				const tokenIdNumber = parseInt(i.args.tokenId, 16);
				let event: Event = {
					ownerAddress: i.args.ownerAddress,
					tokenId: tokenIdNumber,
					secret: i.args.secret,
					verified: Verified.NotChecked,
				};
				return event;
			});

			setEvents(events);

			contract.on(
				"OwnershipApprovalRequest",
				(address, tokenId, secret) => {
					const tokenIdNumber = parseInt(tokenId, 16);
					let event: Event = {
						ownerAddress: address,
						tokenId: tokenIdNumber,
						secret: secret,
						verified: Verified.NotChecked,
					};

					console.log(events);
					console.log(...events);
					let newEvents: Event[] = [...events, event];
					setEvents(newEvents);
				}
			);
		};

		if (user.address) {
			getEventLogs();
		}

		return () => {
			if (contract) {
				contract.removeAllListeners("OwnershipApprovalRequest");
			}
		};
	}, []);

	const verifyEvent = (idx: any) => {
		let newEvents = [...events];
		console.log(newEvents.length - 1 - idx);
		let event: Event = newEvents[newEvents.length - 1 - idx];
		event.verified = Verified.Verified;
		setEvents(newEvents);
	};

	const invalidateEvent = (idx: any) => {
		let newEvents = [...events];
		let event: Event = newEvents[newEvents.length - 1 - idx];
		event.verified = Verified.Invalid;
		setEvents(newEvents);
	};

	const uncheckEvent = (idx: any) => {
		let newEvents = [...events];
		let event: Event = newEvents[newEvents.length - 1 - idx];
		event.verified = Verified.NotChecked;
		setEvents(newEvents);
	};

	return (
		<div>
			<Navbar />

			<Title className={classes.title}>Event Logs</Title>

			<Container mt={50}>
				<Table>
					<thead>
						<tr>
							<th>Address</th>
							<th>Token Id</th>
							<th>Secret Code</th>
						</tr>
					</thead>
					<tbody>
						{events
							.slice(0)
							.reverse()
							.map((nft: Event, idx) => (
								<>
									<tr
										style={{
											backgroundColor:
												verifiedColors[nft.verified],
										}}
									>
										<td>{nft.ownerAddress}</td>
										<td>{nft.tokenId}</td>
										<td>{nft.secret}</td>
										<Group>
											<ActionIcon
												onClick={() => verifyEvent(idx)}
											>
												<Check color="green" />
											</ActionIcon>
											<ActionIcon
												onClick={() =>
													invalidateEvent(idx)
												}
											>
												<AlertCircle color="red" />
											</ActionIcon>
											<ActionIcon
												onClick={() =>
													uncheckEvent(idx)
												}
											>
												<Ban />
											</ActionIcon>
										</Group>
									</tr>
								</>
							))}
					</tbody>
				</Table>
			</Container>
		</div>
	);
};

export default nfts;
