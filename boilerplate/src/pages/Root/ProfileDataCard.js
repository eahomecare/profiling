import { Card, Stack, Group, Title, Flex, Text } from "@mantine/core";
import ArrowLabel from "./ArrowLabel";

const ProfileDataCard = () => {
  const data = [
    { name: "Tech Enthusiastic", value: 1244, color: "#E38627" },
    { name: "Foodies", value: 242, color: "#C13C37" },
    { name: "Auto Lovers", value: 2345, color: "#6A2135" },
    { name: "Gadget Freaks", value: 13123, color: "#FFBB28" },
    { name: "Sports Fans", value: 12320, color: "green" },
    { name: "Musicophile", value: 122, color: "blue" },
    { name: "Avid Traveller", value: 324, color: "purple" },
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
          <Flex key={index} justify={"space-between"}>
            <ArrowLabel
              key={entry.name}
              text={entry.name}
              bgColor={entry.color}
              textColor={"black"}
            />
            {/* <Text c={entry.color} fw={"bold"}> */}
            {/*   • {entry.name} */}
            {/* </Text> */}
            <Text>{entry.value}</Text>
          </Flex>
        ))}
      </Stack>
    </Card>
  );
};

export default ProfileDataCard;
