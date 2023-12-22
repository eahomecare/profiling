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

  console.log("data from ProfileDataCard", data);

  const handleMouseEnter = (name) => {
    dispatch(setHoveredItem(name));
  };

  const handleMouseLeave = () => {
    dispatch(clearHoveredItem());
  };

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card
      withBorder
      shadow={"xl"}
      radius={"md"}
      bg={"#F3F6FF"}
      sx={{ overflowY: "auto", scrollbarColor: "#0d5ff9" }}
    >
      <Stack>
        <Group spacing={"xs"}>
          <Title size={"md"}>Total</Title>
          <Title size={"md"} c={"#0d5ff9"}>
            {totalValue}
          </Title>
        </Group>
        {data.map((entry, index) => (
          <Group
            spacing={0}
            onMouseEnter={() => handleMouseEnter(entry.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Group spacing={0}>
              <Avatar
                key={entry.src}
                src={assets[entry.src]}
                alt="type"
                sx={{
                  transition: "transform 0.3s ease",
                  transform:
                    hoveredItem === entry.name ? "scale(1.1)" : "scale(1)",
                  backgroundImage:
                    hoveredItem === entry.name
                      ? "radial-gradient(#000000 20% ,#0d5ff9)"
                      : "none",
                }}
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
