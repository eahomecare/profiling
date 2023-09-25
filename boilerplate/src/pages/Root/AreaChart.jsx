import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Center, Stack, Text } from "@mantine/core";

const data = [
  { name: "SMS", value: 4000 },
  { name: "Email", value: 3000 },
  { name: "Notification", value: -1000 },
  { name: "Whatsapp", value: 500 },
];

const gradientOffset = () => {
  const dataMax = Math.max(...data.map((i) => i.value));
  const dataMin = Math.min(...data.map((i) => i.value));

  if (dataMax <= 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }

  return dataMax / (dataMax - dataMin);
};

const off = gradientOffset();

const AreaChartSample = () => {
  return (
    <Stack>
      <Center>
        <Box h={400} w={800} p={20}>
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              width={500}
              height={400}
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Communications",
                  angle: -90,
                  position: "left",
                  offset: "-15",
                }}
              />
              <Tooltip />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1} />
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000"
                fill="url(#splitColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Center>
    </Stack>
  );
};

export default AreaChartSample;
