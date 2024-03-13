import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";

// Predefined colors
const COLORS = [
  "#FF638499",
  "#36A2EB99",
  "#FFCE5699",
  "#FF999999",
  "#66FF6699",
  "#FF663399",
  "#FFCC3399",
  "#00CCCC99",
  "#CC660099",
  "#6666FF99",
  "#33996699",
  "#FF996699",
  "#FF663399",
  "#CCCC0099",
  "#FFCCCC99",
  "#66999999",
  "#33669999",
  "#99CC3399",
  "#CC333399",
  "#33CCCC99",
];

const RenderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        style={{ fontSize: "15px" }}
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        style={{ fontSize: "15px" }}
      >
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ProfilePieChart = () => {
  const distribution = useSelector(
    (state) => state.profileCountWidget.distribution,
  );
  const status = useSelector((state) => state.profileCountWidget.status);

  const dataToDisplay = Object.keys(distribution).map((key, index) => ({
    name: key,
    value: distribution[key],
    color: COLORS[index % COLORS.length], // Assuming COLORS is defined elsewhere or you can define it within this component
  }));

  return (
    <Box sx={{ height: 300, width: "100%" }} data-testid="pie-chart">
      {status === "loading" ? (
        "Loading..."
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataToDisplay}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              activeShape={RenderActiveShape}
            >
              {dataToDisplay.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ProfilePieChart;
