import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWidget3MenuItems,
  fetchWidget3Distribution,
} from "../../redux/widget3Slice"; // Ensure path matches
import {
  ActionIcon,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import StyledSelect from "../../StyledComponents/StyledSelect";
import ProfileAnalysisBarChart from "./ProfileAnalysisBarChart";

const ProfileAnalysis = () => {
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const dispatch = useDispatch();
  const { sources, years, months } = useSelector(
    (state) => state.widget3.menuItems,
  );

  useEffect(() => {
    dispatch(fetchWidget3MenuItems());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      source: selectedSource,
    };
    if (selectedYear !== "All") {
      params.year = selectedYear;
      if (selectedMonth !== "All") {
        params.month = selectedMonth;
      }
    }
    dispatch(fetchWidget3Distribution(params));
  }, [dispatch, selectedSource, selectedYear, selectedMonth]);

  return (
    <Card shadow={"md"} radius={"md"}>
      <Box>
        <Flex justify={"space-between"}>
          <Center>
            <Text fw={"bold"} c={"#0d5ff9"} size={"sm"}>
              Profile Analysis
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
        <Grid.Col span={3}>
          <Stack>
            <StyledSelect
              label={"Source(s)"}
              placeholder={"Select Source"}
              data={sources}
              value={selectedSource}
              onChange={setSelectedSource}
            />
            <Group>
              <StyledSelect
                label={"Year"}
                placeholder={"Select Year"}
                data={years}
                value={selectedYear}
                onChange={(value) => {
                  setSelectedYear(value);
                  if (value === "All") setSelectedMonth("All");
                }}
              />
              <StyledSelect
                label={"Month"}
                placeholder={"Select Month"}
                data={selectedYear !== "All" ? months : ["All"]}
                value={selectedMonth}
                onChange={setSelectedMonth}
                disabled={selectedYear === "All"}
              />
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <ProfileAnalysisBarChart />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ProfileAnalysis;
