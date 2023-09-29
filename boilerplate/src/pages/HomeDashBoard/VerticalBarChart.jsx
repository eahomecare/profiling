import { ActionIcon, Box, Center, Select, Stack, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Label,
  LabelList,
  Legend,
} from "recharts";
import StyledSelect from "../../StyledComponents/StyledSelect";

const renderCustomizedLabel = (props) => {
  const { content, ...rest } = props;
  return <Label {...rest} fontSize="12" fill="#FFFFFF" fontWeight="Bold" />;
};

const VerticalBarChart = () => {
  const data = [
    {
      name: "SMS",
      Delivered: 250,
      Interested: 120,
      Converted: 75,
      Failure: 55,
    },
    {
      name: "Email",
      Delivered: 180,
      Interested: 90,
      Converted: 40,
      Failure: 20,
    },
    {
      name: "Notification",
      Delivered: 230,
      Interested: 110,
      Converted: 50,
      Failure: 30,
    },
    {
      name: "Whatsapp",
      Delivered: 275,
      Interested: 135,
      Converted: 85,
      Failure: 60,
    },
  ];

  const campaignNames = useSelector((state) => state.campaign.campaignNames);

  return (
    <Stack>
      <Box>
        <StyledSelect
          maw={320}
          label={"Campaign(s)"}
          data={["All", ...campaignNames]}
        />
      </Box>
      <Center>
        <Box h={400} w={820} p={20}>
          <ResponsiveContainer height={"100%"} width={"100%"}>
            <BarChart layout="vertical" data={data} barSize={30}>
              <XAxis
                label={{ value: "Campaigns", offset: 0 }}
                type="number"
                height={55}
              />
              <YAxis
                label={{
                  value: "Communications",
                  angle: -90,
                  position: "left",
                  offset: "-15",
                }}
                type="category"
                dataKey="name"
                width={150}
              />
              <Tooltip />
              <Legend
                iconType="circle"
                verticalAlign="top"
                align="right"
                offset={-10}
              />
              <Bar dataKey="Delivered" fill="#BB5DE4" stackId="a" />
              <Bar dataKey="Failure" fill="#0D96F9" stackId="a" />
              <Bar dataKey="Interested" fill="#1D9B25" stackId="a" />
              <Bar dataKey="Converted" fill="#D85972" stackId="a">
                <LabelList position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Center>
    </Stack>
  );
};

export default VerticalBarChart;
