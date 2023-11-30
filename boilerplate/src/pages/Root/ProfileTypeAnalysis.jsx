import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Flex,
  Text,
  Grid,
  Center,
  ActionIcon,
  Stack,
  Loader,
  Group,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileData } from "../../redux/profileDataCardSlice.js";
import StyledSelect from "../../StyledComponents/StyledSelect";
import ProfilePieChart from "./PofilePieChart";
import ProfileDataCard from "./ProfileDataCard";

const ProfileTypeAnalysis = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.profileDataCard.status);
  const displayAndColorMappings = useSelector(
    (state) => state.profileDataCard.displayAndColorMappings,
  );

  const [selectedProfile, setSelectedProfile] = useState("all");
  const [selectedDemographic, setSelectedDemographic] = useState("all");

  useEffect(() => {
    console.log("dispatching");
    dispatch(fetchProfileData({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProfile === "all" && selectedDemographic === "all") {
      dispatch(fetchProfileData({}));
    } else if (selectedProfile !== "all" && selectedDemographic !== "all") {
      dispatch(
        fetchProfileData({
          profileType: selectedProfile,
          demographic: selectedDemographic,
        }),
      );
    }
  }, [selectedProfile, selectedDemographic, dispatch]);

  const profileOptions = [
    { value: "all", label: "All" },
    ...Object.entries(displayAndColorMappings).map(
      ([key, { displayName }]) => ({ value: key, label: displayName }),
    ),
  ];

  const demographicOptions = [
    { value: "all", label: "All" },
    { value: "ageRange", label: "Age" },
    { value: "gender", label: "Gender" },
  ];

  return (
    <Flex style={{ width: "100%", alignItems: "flex-start" }}>
      {/* First Card for Selectors and Pie Chart */}
      <Card
        shadow={"lg"}
        radius={"md"}
        style={{ marginRight: "20px", flex: 3 }}
      >
        <Box>
          <Flex justify={"space-between"}>
            <Center>
              <Text fw={"bold"} c={"#0d5ff9"} size={"sm"}>
                Profile
              </Text>
            </Center>
            <Center>
              <ActionIcon c={"#0d5ff9"} size={"sm"}>
                <IconArrowRight />
              </ActionIcon>
            </Center>
          </Flex>
        </Box>
        <Grid grow>
          <Grid.Col span={4}>
            <Stack>
              <StyledSelect
                disabled={status === "loading"}
                label={"Profile"}
                placeholder={"Select Profile(s)"}
                data={profileOptions}
                onChange={(value) => setSelectedProfile(value)}
              />
              <StyledSelect
                disabled={status === "loading"}
                label={"Demographics"}
                placeholder={"Select Main Demographics"}
                data={demographicOptions}
                onChange={(value) => setSelectedDemographic(value)}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={8}>
            <Center>
              {status === "loading" ? (
                <Loader c="5c0ff2" size="lg" />
              ) : (
                <ProfilePieChart />
              )}
            </Center>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Second Card for Profile Data */}
      <Card shadow={"lg"} radius={"md"}>
        <Center style={{ height: "100%" }}>
          <ProfileDataCard />
        </Center>
      </Card>
    </Flex>
  );
};

export default ProfileTypeAnalysis;
