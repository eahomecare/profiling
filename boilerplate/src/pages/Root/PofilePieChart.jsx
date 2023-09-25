import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import {
  setHoveredItem,
  clearHoveredItem,
  selectProfileData,
} from "../../redux/profileDataCardSlice";

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
      <text
        x={cx}
        y={cy + 120}
        dy={8}
        textAnchor="middle"
        fill={"black"}
        font-family="Arial"
        font-weight="bold"
        font-size="14px"
      >
        {payload.name}
      </text>
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
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ProfilePieChart = () => {
  const dispatch = useDispatch();
  const profileData = useSelector(selectProfileData);

  const handleMouseEnter = (data, index) => {
    const name = data.name;
    dispatch(setHoveredItem(name));
  };

  const handleMouseLeave = () => {
    dispatch(clearHoveredItem());
  };

  const hoveredItem = useSelector((state) => state.profileDataCard.hoveredItem);
  const activeIndex = profileData.findIndex(
    (item) => item.name === hoveredItem,
  );

  return (
    <Box h={300} w={500}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={300} height={400}>
          <Pie
            data={profileData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            activeIndex={activeIndex}
            activeShape={RenderActiveShape}
          >
            {profileData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* <Tooltip /> */}
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProfilePieChart;
