import { useState, useEffect } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Card,
  NavLink,
  Container,
  LoadingOverlay,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  IconAdjustmentsHorizontal,
  IconArrowNarrowLeft,
  IconBriefcase,
  IconCar,
  IconCarCrash,
  IconCircleKey,
  IconComet,
  IconFriends,
  IconHammer,
  IconHealthRecognition,
  IconPalette,
  IconReportMoney,
  IconSearch,
  IconSocial,
  IconTimeline,
  IconUser,
} from "@tabler/icons-react";
// import KeywordsEntry from '../KeywordsEntry/KeywordsEntry';
// import Interests from '../Interests/Interests';
import DashboardNavbar from "./DashboardNavbar";
import Profiling from "../../components/Profiling/Profiling";
import PersonalInformation from "../../components/PersonalInformation/PersonalInformation";
import LightDarkButton from "../../components/LightDarkButton";
import { useDispatch, useSelector } from "react-redux";
import KeywordsEntry from "../../components/KeywordsEntry/KeywordsEntry";
import { Notification } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { sleep } from "../../utils/sleep";
import { updateKeywords } from "../../redux/keywordSlice";
import Interests from "../../components/Interests/Interests";


const Dashboard = () => {
  const { status, customerDetails } = useSelector((state) => state.customer);
  const {updateKeywordsStatus} = useSelector((state) => state.keyword)
  const [submitKeywords, setSubmitKeywords] = useState(false);
  const [routesClicked, setRoutesClicked] = useState("");
  const [keywordValues, setKeywordValues] = useState([]);
  const [showNotification,setNotification] = useState(false)

  const { isLoggedIn } = useSelector((state) => state.auth);

  const [selectedCustomer, setSelectedCustomer] = useState();
  const [isLoading, setIsLoading] = useState(true);
  let customer;
  const location = useLocation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //     setTimeout(() => {
  //         if (location?.state?.customer) {
  //             customer = location.state.customer
  //             setSelectedCustomer(customer)
  //             setIsLoading(false)
  //         }
  //     }, 2000)
  // }, [])
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setRoutesClicked((prev) => [...prev, location.pathname]);
  }, [location]);

  function updateKeywordValuesParent(keywords) {
    setKeywordValues(keywords);
  }

  useEffect(() => {
    if (routesClicked.at(-2) && routesClicked.at(-2) === "/dashboard/keywords") {
      

      const updateKeywordPayload = {
        "customerId":customerDetails.id,
        "keywordsPayload":keywordValues
    }

    setNotification(true)
    sleep(5000).then(data => setNotification(false))

    dispatch(updateKeywords(updateKeywordPayload))

    
    }
  }, [routesClicked,dispatch]);

  if (status == "loading") {
    return (
      <LoadingOverlay
        visible
        overlayBlur={2}
        loaderProps={{
          size: "xl",
          variant: "dots",
        }}
      />
    );
  } else {
    return (
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={<DashboardNavbar opened={opened} setOpened={setOpened} />}
        header={
          <Header
            height={{ base: 50, md: 70 }}
            p="md"
            m={"md"}
            withBorder={false}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                ta="center"
                fz="xl"
                fw={700}
                mt={-20}
              >
                EAI CRM
              </Text>
              <TextInput
                placeholder="Search"
                mb="md"
                icon={<IconSearch size="0.9rem" stroke={1.5} />}
                radius="md"
                rightSection={
                  <ActionIcon variant={"subtle"}>
                    <IconAdjustmentsHorizontal />
                  </ActionIcon>
                }
                // value={}
                // onChange={}
              />
              <div>
                <LightDarkButton />
              </div>
            </div>
          </Header>
        }
      >
        <Container>
          <Card
            mt={20}
            shadow={"lg"}
            bg={theme.colorScheme == "light" ? "#F1F5F9" : ""}
            radius={"md"}
            mih={510}
          >
            <Routes>
              <Route>
                <Route
                  index
                  element={
                    <PersonalInformation selectedCustomer={customerDetails} />
                  }
                />
                <Route
                  path="/personalInformation"
                  element={
                    <PersonalInformation selectedCustomer={customerDetails} />
                  }
                />
                <Route path="/profiling" element={<Profiling />} />
                <Route
                  path="/keywords"
                  element={
                    <KeywordsEntry
                      submitKeywords={submitKeywords}
                      updateKeywordValuesParent={updateKeywordValuesParent}
                    />
                  }
                />

                <Route path="/interests" element={<Interests />} />

              </Route>
            </Routes>
          </Card>
          {showNotification && <>
          <Notification
          loading
          title="Background Syncing"
          withCloseButton={true}
          style={{backgroundColor:"red !important"}}
        >
          <p style={{color:"red"}}> Uploading latest keywords data onto server</p>
          
        </Notification>

        </>}
        </Container>
        
        
      </AppShell>
    );
  }
};

export default Dashboard;
