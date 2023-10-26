import React, { useEffect, useState } from "react";
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
  Tooltip,
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
  {
    color: "green",
    text: "No. of Clicks",
    percentage: "85%",
    icon: IconClick,
    label:
      "Number of times that a customer has clicked any othe marketing campaign links",
  },
  {
    color: "orange",
    text: "No. of Bookings",
    percentage: "70%",
    icon: IconCalendar,
    label: "Number of Bookings created",
  },
  {
    color: "purple",
    text: "No. of Payments",
    percentage: "85%",
    icon: IconCreditCard,
    label: "Number of Bookings that followed through with complete payments",
  },
  {
    color: "pink",
    text: "Conversion Rate",
    percentage: "91%",
    icon: IconCone,
    label: "Percentage of payments to bookings",
  },
  {
    color: "teal",
    text: "Bounce Rate",
    percentage: "13%",
    icon: IconBounceLeft,
    label:
      "All the attempts through out all the campaigns that resulted in a failure",
  },
];

const TopPanelCards = () => {
  const [visibleTooltip, setVisibleTooltip] = useState(false);

  return (
    <>
      {data.map((item, index) => (
        <Box
          key={index}
          onMouseEnter={() => setVisibleTooltip(index)}
          onMouseLeave={() => setVisibleTooltip(false)}
        >
          <Card
            sx={{
              height: "100%",
              backgroundImage: "radial-gradient(#FFFFFF 50% ,#F3F6FF)",
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
                  <Tooltip
                    key={`Tooltip-${index}`}
                    label={item.label}
                    color={"EBDFFF"}
                    withArrow
                    opened={visibleTooltip === index}
                  >
                    <ActionIcon size={rem(70)} c={item.color}>
                      <item.icon size={rem(70)} />
                    </ActionIcon>
                  </Tooltip>
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
