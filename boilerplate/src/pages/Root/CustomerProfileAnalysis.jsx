import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems, fetchDistribution } from "../../redux/widget2Slice";
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
import CustomerBarChart from "./CustomerBarChart";

const CustomerProfileAnalysis = () => {
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [filteredMonths, setFilteredMonths] = useState([]);
  const dispatch = useDispatch();
  const {
    sources,
    years,
    months: allMonths,
  } = useSelector((state) => state.widget2.menuItems);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  useEffect(() => {
    if (selectedYear === "All") {
      setFilteredMonths(allMonths);
    } else {
      const yearAsNumber = parseInt(selectedYear, 10);
      if (yearAsNumber < currentYear) {
        setFilteredMonths(allMonths);
      } else if (yearAsNumber === currentYear) {
        const monthNamesToNumbers = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };
        const validMonths = allMonths.filter(
          (month) =>
            month.value === "All" ||
            monthNamesToNumbers[month.value] <= currentMonth,
        );
        setFilteredMonths(validMonths);
      } else {
        setFilteredMonths([{ value: "All", label: "All" }]);
      }
    }
  }, [selectedYear, allMonths, currentYear, currentMonth]);

  useEffect(() => {
    // Dispatch fetchDistribution based on current filters
    const params = {
      source: selectedSource,
      year: selectedYear !== "All" ? selectedYear : undefined,
      month: selectedMonth !== "All" ? selectedMonth : undefined,
    };
    dispatch(fetchDistribution(params));
  }, [dispatch, selectedSource, selectedYear, selectedMonth]);

  return (
    <Card shadow={"md"} radius={"md"}>
      <Box>
        <Flex justify={"space-between"}>
          <Center>
            <Text fw={"bold"} c={"#0d5ff9"} size={"sm"}>
              Customer Analysis
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
              label="Source(s)"
              placeholder="Select Source"
              data={sources}
              value={selectedSource}
              onChange={setSelectedSource}
            />
            <Group>
              <StyledSelect
                label="Year"
                placeholder="Select Year"
                data={years}
                value={selectedYear}
                onChange={(value) => {
                  setSelectedYear(value);
                  setSelectedMonth("All"); // Reset month when year changes
                }}
              />
              <StyledSelect
                label="Month"
                placeholder="Select Month"
                data={filteredMonths}
                value={selectedMonth}
                onChange={setSelectedMonth}
                disabled={selectedYear === "All"}
              />
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <CustomerBarChart />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default CustomerProfileAnalysis;
