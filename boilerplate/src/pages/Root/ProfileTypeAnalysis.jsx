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
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
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
    <Card shadow={"lg"} radius={"md"}>
      <Box>
        <Flex justify={"space-between"}>
          <Center>
            <Text fw={"bold"} c={"#5C00F2"} size={"sm"}>
              Profile
            </Text>
          </Center>
          <Center>
            {/* <Link to={"/campaign"}> */}
            <ActionIcon c={"#5C00F2"} size={"sm"}>
              <IconArrowRight />
            </ActionIcon>
            {/* </Link> */}
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
        <Grid.Col span={4}>
          <Center>
            {status === "loading" ? (
              <Loader c="5c0ff2" size="lg" />
            ) : (
              <ProfilePieChart />
            )}
          </Center>
        </Grid.Col>
        <Grid.Col span={3}>
          <Center>
            {status === "loading" ? (
              <Loader c="5c0ff2" size="lg" />
            ) : (
              <ProfileDataCard />
            )}
          </Center>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ProfileTypeAnalysis;
