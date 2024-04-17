import { useSelector } from "react-redux";
import { Box, Center, Flex, Text } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomerBarChart = () => {
  // Using Redux state for chart data
  const chartData = useSelector((state) => state.widget2.distribution.data);
  const status = useSelector((state) => state.widget2.distribution.fetchStatus);

  // Loading indicator
  if (status === "loading") return <Box>Loading...</Box>;

  // Check if there's data to display
  if (!chartData || chartData.length === 0) {
    return (
      <Box
        h={"400px"}
        w={"full"}
        pt={20}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text size="lg">No Data</Text>
      </Box>
    );
  }

  return (
    <Box h={"400px"} w={"full"} pt={20}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis
            label={{
              value: "No. of Entities",
              angle: -90,
              position: "insideLeft",
              offset: 0,
            }}
          />
          <Tooltip />
          <Legend
            iconType="circle"
            verticalAlign="top"
            align="right"
            offset={-10}
            color={"yellow"}
          />
          <Bar
            dataKey="count"
            stroke="#7366FF"
            strokeWidth={2.36}
            fill="#7366FF"
            fillOpacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomerBarChart;
