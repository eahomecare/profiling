import { useState, useEffect } from "react";
import {
  useMantineTheme,
  Card,
  LoadingOverlay,
  Box,
  Grid,
  Space,
  Center,
  RingProgress,
  Text,
  Badge
} from "@mantine/core";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
// import KeywordsEntry from '../KeywordsEntry/KeywordsEntry';
// import Interests from '../Interests/Interests';
import DashboardNavbar from "./DashboardNavbar";
import Profiling from "../../components/Profiling/Profiling";
import PersonalInformation from "../../components/PersonalInformation/PersonalInformation";
import { useDispatch, useSelector } from "react-redux";
import KeywordsEntry from "../../components/KeywordsEntry/KeywordsEntry";
import { Notification } from "@mantine/core";
import { sleep } from "../../utils/sleep";
import { updateKeywords } from "../../redux/keywordSlice";
import Interests from "../../components/Interests/Interests";
import { Occupation } from "../../components/Occupation/Occupation";
import { FamilyDetails } from "../../components/FamilyDetails/FamilyDetails";
import { Activity } from "../../components/Activity/Activity";
import Remarks from "../../components/AgentPages/Remarks";
import RemarkListings from "../../components/Remarks/RemarkListings";
import { FinancialInformation } from "../../components/FinancialInformation/FinancialInformation";
import { InsuranceDetails } from "../../components/InsuranceDetails/InsuranceDetails";
import { VehicleDetails } from "../../components/VehicleDetails/VehicleDetails";
import { IconUserSquareRounded } from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import { IconUser } from "@tabler/icons-react";
import InfoTag from "./InfoTag";




const Dashboard = () => {
  const { status, customerDetails } = useSelector((state) => state.customer);
  const [profile, setProfile] = useState({
    ...customerDetails.profiling.personal_details,
  });
  const { profile_completion } = customerDetails;

  const { updateKeywordsStatus } = useSelector((state) => state.keyword);
  const [submitKeywords, setSubmitKeywords] = useState(false);
  const [routesClicked, setRoutesClicked] = useState("");
  const [keywordValues, setKeywordValues] = useState([]);
  const [showNotification, setNotification] = useState(false);

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

  const handleSubmitKeywords = () => {

    const payload = {
      customerId: customerDetails.id,
      keywordsPayload: keywordValues,
    };
    setNotification(true);
    sleep(5000).then((data) => setNotification(false));
    dispatch(updateKeywords(payload));


  }

  const profileCompletion = (percentage = 0) => {
    return (
      <div>

        <RingProgress
          mt={0}
          size={100}
          thickness={8}
          sections={[
            {
              value: percentage,
              color:
                percentage > 75
                  ? "#1D9B25"
                  : percentage > 60
                    ? "#CFA400"
                    : "#D85972",
            },
          ]}
          label={
            <Text color="" weight={20} align="center" size="xs">
              {percentage}%
            </Text>
          }
        />
      </div>
    );
  };

  // useEffect(() => {
  //   if (
  //     routesClicked.at(-2) &&
  //     routesClicked.at(-2) === "/dashboard/keywords"
  //   ) {
  //     const updateKeywordPayload = {
  //       customerId: customerDetails.id,
  //       keywordsPayload: keywordValues,
  //     };

  //     setNotification(true);
  //     sleep(5000).then((data) => setNotification(false));

  //     dispatch(updateKeywords(updateKeywordPayload));
  //   }
  // }, [routesClicked, dispatch]);

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
            <Grid.Col span={12}>
              <Card>
                <Grid>
                  <Grid.Col span={2}>
                    <Grid.Col span={12} style={{ textAlign: "center" }}>
                      <Avatar color="blue" size="lg">
                        <IconUser size="lg" />
                      </Avatar>
                    </Grid.Col>
                    {/* <Grid.Col span={12}>
                      <Badge color="yellow" variant="filled" size="lg">HNI</Badge>
                    </Grid.Col> */}

                  </Grid.Col>

                  <Grid.Col span={4}>
                    <Text fw={500}>Basic Info</Text>
                    <Grid.Col span={12}>
                      <InfoTag title={"Name"} subject={profile.full_name} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <InfoTag title={"Mobile Number"} subject={profile.phone_number} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <InfoTag title={"Email Address"} subject={customerDetails.email} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <InfoTag title={"Gender"} subject={profile.gender} />
                    </Grid.Col>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Grid.Col span={12} >
                      <Center> {profileCompletion(profile_completion)}</Center>
                    </Grid.Col>
                  </Grid.Col>

                </Grid>
              </Card>
            </Grid.Col>



            <Grid.Col span={12}>
              <Card shadow={"lg"} radius={"md"}>
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
                          handleSubmitKeywords={handleSubmitKeywords}
                        />
                      }
                    />

                    <Route path="/interests" element={<Interests />} />
                    <Route path="/remarks" element={<RemarkListings />} />
                    <Route path="/occupation" element={<Occupation />} />
                    <Route path="/familydetails" element={<FamilyDetails />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/fi" element={<FinancialInformation />} />
                    <Route path="/id" element={<InsuranceDetails />} />
                    <Route path="/vd" element={<VehicleDetails />} />
                  </Route>
                </Routes>
              </Card>

            </Grid.Col>

            {showNotification && (
              <Notification
                loading
                title="Syncing keywords"
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
