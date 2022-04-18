import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { Container, createStyles, Table, Title } from "@mantine/core";
import { useUser } from "../hooks/useUser";

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

const nfts = () => {
	const { classes } = useStyles();
	const router = useRouter();

	const [walletAddress, setWalletAddress] = useState("");
	const [events, setEvents] = useState([]);
	const { user } = useUser();

	useEffect(() => {
		const getEventLogs = async () => {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const contract = new ethers.Contract(contractAddress, abi, signer);

			contract.on(
				"OwnershipApprovalRequest",
				(address, tokenId, secret) => {
					console.log(
						`Address: ${address}, tokenId: ${tokenId}, secret: ${secret}`
					);
				}
			);

			let eventFilter = contract.filters.OwnershipApprovalRequest();
			let blockNumber = await provider.getBlockNumber();
			let events: any = await contract.queryFilter(
				eventFilter,
				blockNumber - 3000,
				blockNumber
			);

			setEvents(events);
		};

		if (user.address) {
			getEventLogs();
		}
	}, []);

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
						{events.map((nft: any, idx) => (
							<tr>
								<td>{nft.args.ownerAddress}</td>
								<td>{nft.args.tokenId._hex}</td>
								<td>{nft.args.secret}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</div>
	);
};

export default nfts;
