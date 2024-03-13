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
  Alert,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenuItems,
  fetchDistribution,
} from "../../redux/profileCountWidgetSlice";
import StyledSelect from "../../StyledComponents/StyledSelect";
import ProfilePieChart from "./PofilePieChart";
import StyledButton from "../../StyledComponents/StyledButton";

const ProfileTypeAnalysis = () => {
  const dispatch = useDispatch();
  const { menuItems, distribution, status, error } = useSelector(
    (state) => state.profileCountWidget,
  );

  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedDemographic, setSelectedDemographic] = useState("");

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleFetchClick = () => {
    dispatch(
      fetchDistribution({
        profileType: selectedProfile,
        demographic: selectedDemographic,
      }),
    );
  };

  const profileOptions = [
    { value: "", label: "All" },
    ...menuItems.profileTypeItems
      .filter((item) => item !== "All")
      .map((item) => ({
        value: item,
        label: item.charAt(0).toUpperCase() + item.slice(1),
      })),
  ];

  const demographicOptions = [
    { value: "", label: "All" },
    ...menuItems.demographicItems
      .filter((item) => item !== "all")
      .map((item) => ({
        value: item,
        label: item.charAt(0).toUpperCase() + item.slice(1),
      })),
  ];

  const isFetchDisabled = status === "loading";

  return (
    <Flex
      style={{ width: "100%", height: "100%", flex: 1, alignItems: "stretch" }}
    >
      <Flex style={{ marginRight: "20px", flex: 3 }}>
        <Card shadow="lg" radius="md" style={{ width: "100%" }}>
          {error && <Alert color="red">{error}</Alert>}
          <Box>
            <Flex justify="space-between">
              <Center>
                <Text fw="bold" c="#0d5ff9" size="sm">
                  Profile
                </Text>
              </Center>
              <Center>
                <ActionIcon c="#0d5ff9" size="sm">
                  <IconArrowRight />
                </ActionIcon>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={6}>
              <Stack>
                <StyledSelect
                  disabled={status === "loading"}
                  label="Profile Type"
                  placeholder="Select Profile Type"
                  data={profileOptions}
                  value={selectedProfile}
                  onChange={setSelectedProfile}
                />
                <StyledSelect
                  disabled={status === "loading"}
                  label="Demographics"
                  placeholder="Select Demographics"
                  data={demographicOptions}
                  value={selectedDemographic}
                  onChange={setSelectedDemographic}
                />
                <StyledButton
                  onClick={handleFetchClick}
                  disabled={isFetchDisabled}
                  loading={status === "loading"}
                >
                  Fetch
                </StyledButton>
              </Stack>
            </Grid.Col>
            <Grid.Col span={6}>
              <Center>
                {status === "loading" ? (
                  <div data-testid="loader">
                    <Loader size="lg" />
                  </div>
                ) : (
                  <ProfilePieChart distribution={distribution} />
                )}
              </Center>
            </Grid.Col>
          </Grid>
        </Card>
      </Flex>
    </Flex>
  );
};

export default ProfileTypeAnalysis;
