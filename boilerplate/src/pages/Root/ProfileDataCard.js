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
  const data = [
    {
      name: "Techies",
      value: 1244,
      color: "#E38627",
      src: "Techie",
    },
    {
      name: "Foodies",
      value: 242,
      color: "#C13C37",
      src: "Foodie",
    },
    // { name: "Auto Lovers", value: 2345, color: "#6A2135" ,src:'../../components/AgentPages/assets/'},
    {
      name: "Fitness Freaks",
      value: 13123,
      color: "#FFBB28",
      src: "Fitness Freak",
    },
    {
      name: "Sports Fans",
      value: 12320,
      color: "green",
      src: "Sports Fan",
    },
    // { name: "Musicophile", value: 122, color: "blue" ,src:'../../components/AgentPages/assets/Techie.png'},
    {
      name: "Avid Travelers",
      value: 324,
      color: "purple",
      src: "Avid Traveler",
    },
  ];

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
          <Group spacing={"10%"}>
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
