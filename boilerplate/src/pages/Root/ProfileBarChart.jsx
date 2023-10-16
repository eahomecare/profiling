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
          <CartesianGrid vertical={false} strokeDasharray="1" />
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
            color={"yellow"}
          />
          <Bar
            dataKey="promotors"
            stroke="#7366FF"
            strokeWidth={2.36}
            fill="#7366FF"
            fillOpacity={0.7}
          />
          <Bar
            dataKey="detractors"
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

export default ProfileBarChart;
