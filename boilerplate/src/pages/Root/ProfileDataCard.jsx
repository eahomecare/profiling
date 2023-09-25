import { useDispatch, useSelector } from "react-redux";
import {
  setHoveredItem,
  clearHoveredItem,
  selectHoveredItem,
  selectProfileData,
} from "../../redux/profileDataCardSlice";
import {
  Card,
  Stack,
  Group,
  Title,
  Flex,
  Text,
  Avatar,
  Image,
} from "@mantine/core";
import ArrowLabel from "./ArrowLabel";
import assets from "./assets";

const ProfileDataCard = () => {
  const dispatch = useDispatch();
  const hoveredItem = useSelector(selectHoveredItem);
  const data = useSelector(selectProfileData);

  const handleMouseEnter = (name) => {
    dispatch(setHoveredItem(name));
  };

  const handleMouseLeave = () => {
    dispatch(clearHoveredItem());
  };

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card withBorder shadow={"xl"} radius={"md"} bg={"#DDE5FF"}>
      <Stack>
        <Group spacing={"xs"}>
          <Title size={"md"}>Total</Title>
          <Title size={"md"} c={"blue"}>
            {totalValue}
          </Title>
        </Group>
        {data.map((entry, index) => (
          <Group
            spacing={"10%"}
            onMouseEnter={() => handleMouseEnter(entry.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Group spacing={0}>
              <Avatar
                key={entry.src}
                src={assets[entry.src]}
                radius={"xl"}
                size={"lg"}
              />
              <ArrowLabel
                key={entry.name}
                text={entry.name}
                bgColor={entry.color}
                textColor={"black"}
              />
            </Group>
            <Text>{entry.value}</Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};

export default ProfileDataCard;
