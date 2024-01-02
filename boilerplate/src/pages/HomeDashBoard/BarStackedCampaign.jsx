import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Flex,
  MultiSelect,
  Text,
  Title,
  Loader,
} from "@mantine/core";
import { IconArrowRight, IconChevronDown } from "@tabler/icons-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { fetchData, selectCampaign } from "../../redux/campaignSlice";

const BarStackedView = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.campaign.data);
  const campaignNames = useSelector((state) => state.campaign.campaignNames);
  const status = useSelector((state) => state.campaign.status);
  const error = useSelector((state) => state.campaign.error);

  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <Loader
        c="5c00f2"
        style={{ margin: "0 auto", display: "block" }}
        size={50}
      />
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const handleCampaignSelect = (selected) => {
    setSelectedCampaigns(selected);
    dispatch(selectCampaign(selected));
  };

  const filteredData =
    selectedCampaigns.length > 0
      ? data.filter((campaign) =>
          selectedCampaigns.includes(campaign.campaignName),
        )
      : data;

  // Map API data to chart data
  const chartData = filteredData.map((item) => ({
    ...item,
    delivered: item.totalSent,
    converted: item.success,
    interested: item.success,
    failure: item.failed,
  }));

  return (
    <>
      <Box p={30}>
        <Flex justify={"space-between"}>
          <Title c={"#0d5ff9"}>Campaigns</Title>
          <Link to={"/campaign"}>
            <ActionIcon c={"#0d5ff9"} size={"sm"}>
              <IconArrowRight />
            </ActionIcon>
          </Link>
        </Flex>
        <Box>
          <Flex>
            <MultiSelect
              maw={320}
              mx="auto"
              data={campaignNames}
              label={<Text c={"dimmed"}>Campaign(s)</Text>}
              rightSection={
                <ActionIcon>
                  <IconChevronDown />
                </ActionIcon>
              }
              onChange={handleCampaignSelect}
              value={selectedCampaigns}
            />
          </Flex>
        </Box>
        <Box h={500} w={"100%"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              maxBarSize={60}
            >
              <CartesianGrid
                strokeLinecap="3"
                horizontalCoordinatesGenerator={(props) =>
                  props.height > 250 ? [75, 150, 225] : [100, 200]
                }
                vertical={false}
              />
              <XAxis dataKey="campaignName" />
              <YAxis
                label={{
                  value: "No. of Customers",
                  angle: -90,
                  position: "insideLeft",
                  offset: -4,
                }}
              />
              <Tooltip />
              <Legend
                iconType="circle"
                verticalAlign="top"
                align="right"
                offset={-10}
              />
              <Bar
                dataKey="delivered"
                stackId="a"
                fill="#5C7DF2"
                stroke="#5C7DF2"
                strokeWidth={2.36}
                fillOpacity={0.7}
              />
              <Bar
                stackId="a"
                dataKey="failure"
                stroke="#F73164"
                strokeWidth={2.36}
                fill="#F73164"
                fillOpacity={0.7}
              />
              <Bar
                dataKey="interested"
                stackId="a"
                fill="#F78C31"
                stroke="#F78C31"
                strokeWidth={2.36}
                fillOpacity={0.7}
              />
              <Bar
                dataKey="converted"
                stackId="a"
                fill="#4BCA74"
                stroke="#4BCA74"
                strokeWidth={2.36}
                fillOpacity={0.7}
              >
                <LabelList position={"top"} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
};

export default BarStackedView;
