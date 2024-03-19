import { useSelector } from "react-redux";
import { Box } from "@mantine/core";
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomerBarChart;
