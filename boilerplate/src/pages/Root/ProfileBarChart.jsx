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

const data = [
  {
    name: "Tech Enthusiastic",
    detractors: 4000,
    promotors: 2400,
  },
  {
    name: "Foodies",
    detractors: 3000,
    promotors: 2210,
  },
  {
    name: "Auto Lovers",
    detractors: 2000,
    promotors: 2290,
  },
  {
    name: "Gadget Freaks",
    detractors: 2780,
    promotors: 2000,
  },
  {
    name: "Sports Fans",
    detractors: 1890,
    promotors: 2181,
  },
  {
    name: "Musicophile",
    detractors: 2390,
    promotors: 2500,
  },
  {
    name: "Avid Traveller",
    detractors: 3490,
    promotors: 2100,
  },
];

const ProfileBarChart = () => {
  return (
    <Box h={"400px"} w={"870px"} pt={20}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          // width={500}
          // height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "No. of Customers",
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
          />
          <Bar dataKey="detractors" fill="#8884d8" />
          <Bar dataKey="promotors" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProfileBarChart;
