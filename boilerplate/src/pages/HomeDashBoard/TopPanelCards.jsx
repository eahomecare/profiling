import React from "react";
import {
  Box,
  Card,
  Center,
  Flex,
  Group,
  ActionIcon,
  Text,
  Stack,
  rem,
} from "@mantine/core";
import {
  IconBounceLeft,
  IconCalendar,
  IconClick,
  IconClock,
  IconCone,
  IconCreditCard,
  IconSearch,
  IconView360,
} from "@tabler/icons-react";

const data = [
  { color: "green", text: "No. of Clicks", percentage: "85%", icon: IconClick },
  {
    color: "orange",
    text: "No. of Bookings",
    percentage: "70%",
    icon: IconCalendar,
  },
  {
    color: "purple",
    text: "No. of Payments",
    percentage: "85%",
    icon: IconCreditCard,
  },
  { color: "pink", text: "Conversion Rate", percentage: "91%", icon: IconCone },
  // {
  //   color: "yellow",
  //   text: "No. of Views",
  //   percentage: "70%",
  //   icon: IconView360,
  // },
  // {
  //   color: "teal",
  //   text: "No. of Searchs",
  //   percentage: "70%",
  //   icon: IconSearch,
  // },
  // {
  //   color: "blue",
  //   text: "No. of Sessions",
  //   percentage: "63%",
  //   icon: IconClock,
  // },
  {
    color: "teal",
    text: "Bounce Rate",
    percentage: "13%",
    icon: IconBounceLeft,
  },
];

const TopPanelCards = () => {
  return (
    <>
      {data.map((item, index) => (
        <Box key={index}>
          <Card
            sx={{
              height: "100%",
              backgroundImage: "radial-gradient(#FFFFFF 50% ,#EBDFFF)",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              ":hover": {
                transform: "scale(1.05)",
              },
            }}
            radius={"md"}
            shadow="md"
          >
            <Center>
              <Flex>
                <Group noWrap>
                  <ActionIcon size={rem(70)} c={item.color}>
                    <item.icon size={rem(70)} />
                  </ActionIcon>
                  <Stack justify={"start"}>
                    <Text>{item.text}</Text>
                    <Text c={item.color}>{item.percentage}</Text>
                  </Stack>
                </Group>
              </Flex>
            </Center>
          </Card>
        </Box>
      ))}
    </>
  );
};

export default TopPanelCards;
