import React from "react";
import {
	createStyles,
	Menu,
	Center,
	Header,
	Container,
	Group,
	Button,
	Burger,
	Text,
	Tooltip,
	Title,
	Box,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { useUser } from "../hooks/useUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { flexbox } from "@chakra-ui/react";
// import { ChevronDown } from 'tabler-icons-react';
// import { MantineLogo } from '../../shared/MantineLogo';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
	inner: {
		height: HEADER_HEIGHT,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},

	links: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
		cursor: "pointer",
	},

	nav: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	burger: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	link: {
		marginBottom: "5px",
		display: "block",
		lineHeight: 1,
		padding: "8px 12px",
		borderRadius: theme.radius.sm,
		textDecoration: "none",
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[7],
		fontSize: theme.fontSizes.md,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
		},
	},

	navbar: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	linkLabel: {
		marginRight: 5,
	},

	wrap: {
		display: "flex",
		flexDirection: "column",
	},
}));

const links = [
	{ link: "buytickets", label: "Buy Tickets" },
	{ link: "mytickets", label: "My Tickets" },
	{ link: "eventlogs", label: "Event logs" },
	{ link: "marketplace", label: "Marketplace" },
];

export default function Navbar() {
	const { user, connectWeb3Modal, switchNetwork } = useUser();
	const { classes } = useStyles();
	const [opened, toggleOpened] = useBooleanToggle(false);
	const router = useRouter();

	const items = links.map((link) => {
		return (
			<Link key={link.label} href={link.link}>
				<Button
					color="dark"
					variant="subtle"
					styles={(theme) => ({
						root: {
							"&:hover": {
								backgroundColor: theme.fn.darken("#f2f2f2", 0),
							},
						},

						leftIcon: {
							marginRight: 15,
						},
					})}
				>
					{link.label}
				</Button>
			</Link>
		);
	});

	const NavbarContent = () => {
		return (
			<>
				<Group hidden={opened} spacing={5} className={classes.links}>
					{items}
				</Group>
				<Group className={classes.links}>
					{user.address !== "" && user.network == "maticmum" ? (
						<Tooltip
							transition="fade"
							transitionDuration={200}
							label="Connected to Mumbai Network"
							withArrow
						>
							<Text size="md">Mumbai</Text>
						</Tooltip>
					) : (
						<Tooltip
							opened
							label="Click to switch to Mumbai Network"
							withArrow
						>
							<Button
								variant="outline"
								size="sm"
								color="red"
								sx={{ height: 30 }}
								onClick={switchNetwork}
							>
								Unsupported Network!
							</Button>
						</Tooltip>
					)}
					<Button
						size="md"
						sx={{ height: 35 }}
						onClick={connectWeb3Modal}
					>
						{user.displayName !== "" ? user.displayName : "Sign in"}
					</Button>
				</Group>
			</>
		);
	};

	const MobileNavbar = () => {
		return (
			<>
				<Container className={classes.wrap}>
					<Box hidden={!opened} className={classes.nav}>
						{items}
					</Box>
					<Group hidden={!opened} className={classes.nav}>
						{
							user.network == "maticmum" ? (
								<Tooltip
									transition="fade"
									transitionDuration={200}
									label="Connected to Mumbai Network"
									withArrow
								>
									<Text size="md">Mumbai</Text>
								</Tooltip>
							) : null
							//   <Tooltip
							//   opened
							//   label="Click to switch to Mumbai Network"
							//   withArrow
							// >
							//   <Button variant="outline" size='sm' color='red' sx={{ height: 30 }} onClick={switchNetwork}>
							//     Unsupported Network!
							//   </Button>
							// </Tooltip>
						}
						<Button
							size="md"
							sx={{ height: 35 }}
							onClick={connectWeb3Modal}
						>
							{user.displayName !== ""
								? user.displayName
								: "Sign in"}
						</Button>
					</Group>
				</Container>
			</>
		);
	};

	return (
		<Header height={HEADER_HEIGHT} mb={120}>
			<Container size="xl" className={classes.inner}>
				<Group>
					<Burger
						opened={opened}
						onClick={() => toggleOpened()}
						className={classes.burger}
						size="sm"
					/>

					<Link href="/">
						<Title order={3} className={classes.links}>
							Event X
						</Title>
					</Link>
				</Group>
				<NavbarContent />
			</Container>
			<MobileNavbar />
		</Header>
	);
}
