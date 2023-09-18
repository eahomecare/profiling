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
  Group,
  Box,
  Grid,
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
import { Occupation } from "../../components/Occupation/Occupation";
import { FamilyDetails } from "../../components/FamilyDetails/FamilyDetails";
import { Activity } from "../../components/Activity/Activity";

const Dashboard = () => {
  const { status, customerDetails } = useSelector((state) => state.customer);
  const { updateKeywordsStatus } = useSelector((state) => state.keyword)
  const [submitKeywords, setSubmitKeywords] = useState(false);
  const [routesClicked, setRoutesClicked] = useState("");
  const [keywordValues, setKeywordValues] = useState([]);
  const [showNotification, setNotification] = useState(false)

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
        "customerId": customerDetails.id,
        "keywordsPayload": keywordValues
      }

      setNotification(true)
      sleep(5000).then(data => setNotification(false))

      dispatch(updateKeywords(updateKeywordPayload))


    }
  }, [routesClicked, dispatch]);

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
      <Box>
        <Grid>
          <Grid.Col span={3}>
            <Box>
              <DashboardNavbar />
            </Box>
          </Grid.Col>

          <Grid.Col span={9}>
            <Card
              shadow={"lg"}
              bg={theme.colorScheme == "light" ? "#F1F5F9" : ""}
              radius={"md"}
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
                  <Route path="/occupation" element={<Occupation />} />
                  <Route path="/familydetails" element={<FamilyDetails />} />
                  <Route path="/activity" element={<Activity />} />


                </Route>
              </Routes>
            </Card>
            {showNotification && (
              <Notification
                loading
                title="Background Syncing"
                withCloseButton={true}
                style={{ backgroundColor: "red !important" }}
              >
                <p style={{ color: "red" }}>
                  Uploading latest keywords data onto server
                </p>
              </Notification>
            )}
          </Grid.Col>
        </Grid>
      </Box>
    );
  }
};

export default Dashboard;