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

  const [selectedProfile, setSelectedProfile] = useState("none");
  const [selectedDemographic, setSelectedDemographic] = useState("none");

  useEffect(() => {
    console.log("dispatching");
    dispatch(fetchProfileData({}));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProfile === "none" && selectedDemographic === "none") {
      dispatch(fetchProfileData({}));
    } else if (selectedProfile !== "none" && selectedDemographic !== "none") {
      dispatch(
        fetchProfileData({
          profileType: selectedProfile,
          demographic: selectedDemographic,
        }),
      );
    }
  }, [selectedProfile, selectedDemographic, dispatch]);

  const profileOptions = [
    { value: "none", label: "None" },
    ...Object.entries(displayAndColorMappings).map(
      ([key, { displayName }]) => ({ value: key, label: displayName }),
    ),
  ];

  const demographicOptions = [
    { value: "none", label: "None" },
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
              label={"Profile"}
              placeholder={"Select Profile(s)"}
              data={profileOptions}
              onChange={(value) => setSelectedProfile(value)}
            />
            <StyledSelect
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
