import { Box } from "@mantine/core";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Techies", value: 1244 },
  { name: "Foodies", value: 2423 },
  // { name: "Auto Lovers", value: 2345 },
  { name: "Fitness Freaks", value: 13123 },
  { name: "Sports Fans", value: 12320 },
  // { name: "Musicophile", value: 122 },
  { name: "Avid Travelers", value: 3234 },
];

const COLORS = [
  "#E38627",
  "#C13C37",
  // "#6A2135",
  "#FFBB28",
  "green",
  // "blue",
  "purple",
];

const ProfilePieChart = () => {
  return (
    <Box h={300} w={300}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProfilePieChart;
