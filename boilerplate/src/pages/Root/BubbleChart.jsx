import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Function to generate data
const generateData = () => {
  const hours = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];
  return hours.map((hour) => ({
    hour,
    index: 1,
    value: Math.floor(100 + Math.random() * 200), // Random values between 100 and 300
  }));
};

const smsData = generateData();
const whatsappData = generateData();
const emailData = generateData();
const notificationData = generateData();
const datasets = [smsData, whatsappData, emailData, notificationData];

const parseDomain = () => [
  0,
  Math.max(
    ...datasets.map((data) => Math.max(...data.map((entry) => entry.value))),
  ),
];

const RenderTooltip = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #999",
          margin: 0,
          padding: 10,
        }}
      >
        <p>{data.hour}</p>
        <p>
          <span>value: </span>
          {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const BubbleChart = () => {
  const domain = parseDomain();
  const range = [16, 225];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#a4de6c"];

  return (
    <div style={{ width: "100%" }}>
      {datasets.map((data, idx) => (
        <ResponsiveContainer key={idx} width="100%" height={60}>
          <ScatterChart
            width={800}
            height={60}
            margin={{
              top: 10,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis
              type="category"
              dataKey="hour"
              name="hour"
              interval={0}
              tick={{ fontSize: 0 }}
              tickLine={{ transform: "translate(0, -6)" }}
            />
            <YAxis
              type="number"
              dataKey="index"
              height={10}
              width={80}
              tick={false}
              tickLine={false}
              axisLine={false}
              label={{ value: days[idx], position: "insideRight" }}
            />
            <ZAxis
              type="number"
              dataKey="value"
              domain={domain}
              range={range}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              wrapperStyle={{ zIndex: 100 }}
              content={RenderTooltip}
            />
            <Scatter data={data} fill={colors[idx % colors.length]} />
          </ScatterChart>
        </ResponsiveContainer>
      ))}
    </div>
  );
};

export default BubbleChart;
