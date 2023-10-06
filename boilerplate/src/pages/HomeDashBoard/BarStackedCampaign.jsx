import { ActionIcon, Box, Flex, Select, Text, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
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
} from "../../redux/campaignSlice";

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

  return (
    <>
      <Box p={30} h={500} w={"100%"}>
        <Title c={"#5C0FF2"}>Other Campaign Comparison</Title>
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
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
            <Bar dataKey="delivered" stackId="a" fill="#8334f8" />
            <Bar dataKey="failure" stackId="a" fill="#8884d8" />
            <Bar dataKey="interested" stackId="a" fill="#883538" />
            <Bar dataKey="converted" stackId="a" fill="#82ca9d">
              <LabelList position={"top"} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default BarStackedView;
