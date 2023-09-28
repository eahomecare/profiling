import { Container } from "@mantine/core";
import { useState } from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Legend,
  Brush,
} from "recharts";

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSmoothNumber = (previousValue, minDelta, maxDelta) => {
  const delta = generateRandomNumber(minDelta, maxDelta);
  const direction = Math.random() > 0.5 ? 1 : -1;

  let newValue = previousValue + direction * delta;

  if (newValue > 9000) newValue = 9000;
  if (newValue < 1000) newValue = 1000;

  return newValue;
};

const generateData = () => {
  const months = [
    "Apr 2022",
    "May 2022",
    "Jun 2022",
    "Jul 2022",
    "Aug 2022",
    "Sep 2022",
    "Oct 2022",
    "Nov 2022",
    "Dec 2022",
    "Jan 2023",
    "Feb 2023",
    "Mar 2023",
    "Apr 2023",
    "May 2023",
    "Jun 2023",
    "Jul 2023",
    "Aug 2023",
    "Sep 2023",
    "Oct 2023",
  ];

  let previousUv = generateRandomNumber(1000, 9000);
  let previousPv = generateRandomNumber(1000, 9000);

  return months.map((month) => {
    const uv = generateSmoothNumber(previousUv, 1000, 3000);
    const pv = generateSmoothNumber(previousPv, 100, 1000);

    previousUv = uv;
    previousPv = pv;

    return {
      name: month,
      Customer: uv,
      Profile: pv,
    };
  });
};

const AreaChartSample = () => {
  const [data, setData] = useState(generateData());

  return (
    <Container>
      <AreaChart
        onClick={() => setData(generateData())}
        width={850}
        height={400}
        data={data}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7366FF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#7366FF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F73164" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F73164" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis
          label={{
            value: "No. of Customers",
            angle: -90,
            position: "insideLeft",
            offset: 0,
          }}
        />
        <CartesianGrid vertical={false} strokeDasharray="1" />
        <Tooltip />
        <Legend
          iconType="circle"
          verticalAlign="top"
          align="right"
          offset={-10}
        />
        <Area
          type="monotone"
          dataKey="Customer"
          stroke="#7366FF"
          strokeWidth={2.36}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="Profile"
          stroke="#F73164"
          strokeWidth={2.36}
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </Container>
  );
};

export default AreaChartSample;
