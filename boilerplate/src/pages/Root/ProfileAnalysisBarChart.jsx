import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchCustomerProfileData } from "../../redux/profileAnalysisSlice"; // Ensure correct path

const ProfileAnalysisBarChart = () => {
  const dispatch = useDispatch();

  // Fetching data on component mount
  useEffect(() => {
    dispatch(fetchCustomerProfileData());
  }, [dispatch]);

  // Get data from the Redux store
  const chartData = useSelector((state) => state.customerProfileTool.data);
  const status = useSelector((state) => state.customerProfileTool.status);

  // If data is still loading, display a loading indicator (you can adjust this as per your requirements)
  if (status === "loading") return <div>Loading...</div>;

  return (
    <Box h={"400px"} w={"870px"} pt={20}>
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
          <CartesianGrid vertical={false} strokeDasharray="1" />
          <XAxis dataKey="name" />
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
            dataKey="profiles"
            stroke="#F73164"
            strokeWidth={2.36}
            fill="#F73164"
            fillOpacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProfileAnalysisBarChart;
