import { IconArrowNarrowLeft, IconBriefcase, IconCar, IconCarCrash, IconCircleKey, IconComet, IconFriends, IconHealthRecognition, IconPalette, IconReportMoney, IconSocial, IconTimeline, IconUser } from '@tabler/icons-react';
import { createStyles, Navbar, Group, Code, getStylesRef, rem, NavLink, Card, useMantineTheme, Stack } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const useStyles = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
        // padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#4E70EA',
            color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',

            [`& .${getStylesRef('icon')}`]: {
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef('icon'),
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        '&, &:hover': {
            // backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            backgroundColor: theme.colorScheme === 'dark' ? '#252D3B' : '#4E70EA',
            // color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',
            [`& .${getStylesRef('icon')}`]: {
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
            },
        },
    },
}));


const data = [
    { link: 'personalInformation', label: 'Personal Information', icon: <IconUser /> },
    { link: 'keywords', label: 'Keywords', icon: <IconCircleKey /> },
    { link: 'profiling', label: 'Profiling', icon: <IconTimeline /> },
    { link: 'interests', label: 'Interests', icon: <IconPalette /> },
    { link: 'occupation', label: 'Occupation', icon: <IconBriefcase /> },
    { link: 'Activity', label: 'Activity', icon: <IconComet /> },
    { link: 'familydetails', label: 'Family Details', icon: <IconFriends /> },
    { link: 'Financial Information', label: 'Financial Information', icon: <IconReportMoney /> },
    { link: 'Insurance Details', label: 'Insurance Details  ', icon: <IconCarCrash /> },
    { link: 'Vehicle', label: 'Vehicle', icon: <IconCar /> },
    { link: 'Health', label: 'Health', icon: <IconHealthRecognition /> },
    { link: 'Social Media', label: 'Social Media', icon: <IconSocial /> },
];

const DashboardNavbar = ({ opened, setOpened }) => {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState('Personal Information');
    const theme = useMantineTheme();

    const links = data.map((item) => (
        <NavLink
            className={cx(classes.link, { [classes.linkActive]: item.label === active })}
            icon={item.icon}
            component={Link}
            variant="subtle"
            to={item.link}
            label={item.label}
            key={item.label}
            onClick={(event) => {
                setActive(item.label)
            }}
        />
    ));

    return (
        <Navbar
            height={700}
            // width={{ sm: 300 }}
            p="md"
            className={classes.navbar}
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
            withBorder={false}
        >
            <Stack>
                <Card
                    bg={theme.colorScheme == 'light' ? '#DDE5FF' : ''}
                    mt={20}
                >
                    <Navbar.Section grow>
                        {links}
                    </Navbar.Section>
                </Card>

                <Navbar.Section>
                    <NavLink icon={<IconArrowNarrowLeft />} component={Link} variant="subtle" to='/customers' label={'Go Back'} rightSection />
                </Navbar.Section>
            </Stack>
        </Navbar >
    );
}

export default DashboardNavbar