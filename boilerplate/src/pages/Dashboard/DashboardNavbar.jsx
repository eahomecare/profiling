import {
  IconArrowNarrowLeft,
  IconBriefcase,
  IconCar,
  IconCarCrash,
  IconCircleKey,
  IconClipboardText,
  IconComet,
  IconFriends,
  IconHealthRecognition,
  IconPalette,
  IconReportMoney,
  IconSocial,
  IconTimeline,
  IconUser,
} from "@tabler/icons-react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  getStylesRef,
  rem,
  NavLink,
  Card,
  useMantineTheme,
  Stack,
  Box,
} from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    borderRadius: theme.radius.md,
    // border: "1px solid #0d5ff9",
    marginTop: 5,
    fontWeight: 500,
    "&": {
      // backgroundColor:
      //   theme.colorScheme === "dark" ? theme.colors.dark[6] : "#F3F6FF",
      color: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#0D5FF9",
      boxShadow: `
 rgba(13, 95, 249, 1) 0px 1px 1px,
 rgba(13, 95, 249, 0.5) 0px 2px 2px,
 rgba(13, 95, 249, 0.5) 0px 2px 5px,
 rgba(13, 95, 249, 0.5) 0px 2px 5px,
 rgba(13, 95, 249, 0.5) 0px 3px 5px
      `,
      /* From https://css.glass */
      background: "rgba(, 1)",
      borderRadius: "16px",
      // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(5.1px)",
      border: "1px solid rgba(, 0.42)",
      webkitBackdropFilter: "blur(5.1px)",
      //       boxShadow: `
      //     rgba(92, 0, 242, 0.09) 0px 4px 2px,
      //     rgba(92, 0, 242, 0.09) 0px 32px 16px
      // `,
    },
    "&:focus": {
      outline: "none",
    },
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[6] : "#0d5ff990",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateX(5px)",
      },
    },
  },
  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },
  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.colorScheme === "dark" ? "#252D3B" : "#0d5ff9",
      color: theme.colorScheme === "dark" ? theme.white : "#FFFFFF",
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
  stickyNavbar: {
    position: "sticky",
    height: "100%",
    top: 0,
  },
}));

// const useStyles = createStyles((theme) => ({
//     link: {
//         ...theme.fn.focusStyles(),
//         display: 'flex',
//         alignItems: 'center',
//         textDecoration: 'none',
//         fontSize: theme.fontSizes.sm,
//         color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
//         // padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
//         borderRadius: theme.radius.sm,
//         fontWeight: 500,
//
//         '&:hover': {
//             backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#4E70EA',
//             color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',
//
//             [`& .${getStylesRef('icon')}`]: {
//                 color: theme.colorScheme === 'dark' ? theme.white : theme.black,
//             },
//         },
//     },
//
//     linkIcon: {
//         ref: getStylesRef('icon'),
//         color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
//         marginRight: theme.spacing.sm,
//     },
//
//     linkActive: {
//         '&, &:hover': {
//             // backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
//             backgroundColor: theme.colorScheme === 'dark' ? '#252D3B' : '#4E70EA',
//             // color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
//             color: theme.colorScheme === 'dark' ? theme.white : '#FFFFFF',
//             [`& .${getStylesRef('icon')}`]: {
//                 color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
//             },
//         },
//     },
// }));

const data = [
  {
    link: "personalInformation",
    label: "Personal Information",
    icon: <IconUser />,
  },
  { link: "keywords", label: "Keywords", icon: <IconCircleKey /> },
  { link: "profiling", label: "Profiling", icon: <IconTimeline /> },
  { link: "interests", label: "Interests", icon: <IconPalette /> },
  { link: "remarks", label: "Remarks", icon: <IconClipboardText /> },
  { link: "occupation", label: "Occupation", icon: <IconBriefcase /> },
  { link: "activity", label: "Activity", icon: <IconComet /> },
  { link: "familydetails", label: "Family Details", icon: <IconFriends /> },
  { link: "fi", label: "Financial Information", icon: <IconReportMoney /> },
  { link: "id", label: "Insurance Details  ", icon: <IconCarCrash /> },
  { link: "vd", label: "Vehicle", icon: <IconCar /> },
  { link: "Health", label: "Health", icon: <IconHealthRecognition /> },
  { link: "Social Media", label: "Social Media", icon: <IconSocial /> },
];

const DashboardNavbar = () => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Personal Information");
  const theme = useMantineTheme();

  const location = useLocation();
  const { myRole } = useSelector((state) => state.auth);


  const links = data
    .filter((item, index) => (myRole === 'qc' ? index < 2 : true))
    .map((item) => (
      <NavLink
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
        icon={item.icon}
        component={Link}
        variant="subtle"
        to={item.link}
        label={item.label}
        key={item.label}
        onClick={(event) => {
          setActive(item.label);
        }}
      />
    ));
  return (
    <Box height={700} p="md" width={{ sm: 200, lg: 300 }} withBorder={false}>
      <Stack>
        <Box
          sx={{
            borderRadius: 10,
            padding: 2,
          }}
        >
          <Navbar.Section grow>{links}</Navbar.Section>
        </Box>

        <Navbar.Section>
          <NavLink
            icon={<IconArrowNarrowLeft />}
            component={Link}
            variant="subtle"
            to={"/customers"}
            c="#0d5ff9"
            sx={{
              cursor: "pointer",
              borderRadius: 10,
            }}
            label={"Go Back"}
            rightSection
          />
        </Navbar.Section>
      </Stack>
    </Box>
  );
};

export default DashboardNavbar;
