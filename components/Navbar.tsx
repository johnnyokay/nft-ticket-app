import React from 'react';
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
  Title
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'next/router';
// import { ChevronDown } from 'tabler-icons-react';
// import { MantineLogo } from '../../shared/MantineLogo';

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

const links = [
  {"link": "buytickets", "label": "Buy Tickets"},
  {"link": "mytickets", "label": "My Tickets"},
  {"link": "eventlogs", "label": "Event logs"},
]

export default function Navbar() {
  const { user, connectWeb3Modal, switchNetwork } = useUser()
  const { classes } = useStyles();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const router = useRouter()

  const items = links.map((link) => {
    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        onClick={() => router.push('/mytickets')}
      >
        {link.label}
      </a>
    );
  });

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
          {/* <MantineLogo /> */}
          <Title onClick={() => router.push('/')} order={3} >
            Event X
          </Title>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Group>
          {user.network == "maticmum" ? 
          <Tooltip
          transition="fade"
          transitionDuration={200}
          label="Connected to Mumbai Network"
          withArrow
        >
          <Text size='md' >
              Mumbai
            </Text>
        </Tooltip>
            
              :
            
            <Tooltip
            opened
            label="Click to switch to Mumbai Network"
            withArrow
          >
            <Button variant="outline" size='sm' color='red' sx={{ height: 30 }} onClick={switchNetwork}>
              Unsupported Network!
            </Button>
          </Tooltip>
          }
          <Button size='md' sx={{ height: 35 }} onClick={connectWeb3Modal}>
            {user.displayName}
          </Button>
        </Group>
      </Container>
    </Header>
  );
}