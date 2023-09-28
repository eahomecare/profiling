import { Box } from "@mantine/core";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Customer",
    count: 6000,
    fill: "#D85972",
  },
  {
    name: "Profile",
    count: 2482,
    fill: "#0D96F9",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const RadialChart = () => {
  return (
    <Box h={"400px"} w={"570px"}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={30}
          data={data}
        >
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff" }}
            background={{ fill: "#EBDFFF" }}
            clockWise
            dataKey="count"
          />
          <Legend
            iconSize={10}
            iconType={"circle"}
            verticalAlign="top"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RadialChart;
