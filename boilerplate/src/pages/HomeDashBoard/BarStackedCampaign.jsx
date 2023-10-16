import {
  ActionIcon,
  Box,
  Flex,
  Select,
  Text,
  Title,
  Loader,
  Group,
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
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchData,
  fetchSources,
  fetchCampaignNames,
  selectCampaign,
} from "../../redux/campaignSlice";
import { Link } from "react-router-dom";

const BarStackedView = () => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.campaign.data);
  const sources = useSelector((state) => state.campaign.sources);
  const campaignNames = useSelector((state) => state.campaign.campaignNames);
  const status = useSelector((state) => state.campaign.status);
  const error = useSelector((state) => state.campaign.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchData());
      dispatch(fetchSources());
      dispatch(fetchCampaignNames());
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

  return (
    <>
      <Box p={30}>
        <Flex justify={"space-between"}>
          <Title c={"#5C0FF2"}>Campaigns</Title>
          <Link to={"/campaign"}>
            <ActionIcon c={"#5C00F2"} size={"sm"}>
              <IconArrowRight />
            </ActionIcon>
          </Link>
        </Flex>
        <Box>
          <Flex>
            <Select
              maw={320}
              mx="auto"
              label={<Text c={"dimmed"}>Campaign(s)</Text>}
              data={["All", ...campaignNames]}
              transitionProps={{
                transition: "pop-top-left",
                duration: 80,
                timingFunction: "ease",
              }}
              withinPortal
              rightSection={
                <ActionIcon>
                  <IconChevronDown />
                </ActionIcon>
              }
              onChange={(value) => dispatch(selectCampaign(value))}
            />
            <Select
              maw={320}
              mx="auto"
              label={<Text c={"dimmed"}>Source(s)</Text>}
              data={sources}
              transitionProps={{
                transition: "pop-top-left",
                duration: 80,
                timingFunction: "ease",
              }}
              withinPortal
              rightSection={
                <ActionIcon>
                  <IconChevronDown />
                </ActionIcon>
              }
            />
          </Flex>
        </Box>
        <Box h={500} w={"100%"}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
              <XAxis dataKey="name" />
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
