import {
  Box,
  Card,
  Stack,
  Title,
  Text,
  Grid,
  Select,
  ActionIcon,
  Center,
  Flex,
  Group,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowRight,
  IconChevronDown,
  IconTableExport,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import AreaChartSample from "./AreaChart";
import BubbleChart from "./BubbleChart";
import ProfilePieChart from "./PofilePieChart";
import ProfileBarChart from "./ProfileBarChart";
import ProfileDataCard from "./ProfileDataCard";

const Root = () => {
  return (
    <Box>
      <Title>Profile</Title>
      <Stack>
        <Card shadow={"md"} bg={"#DDE5FF"} radius={"md"}>
          <Box>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#4E70EA"} size={"sm"}>
                  Profile
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#4E70EA"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <Select
                  label={<Text c={"dimmed"}>Profile(s)</Text>}
                  placeholder={"Select Profile(s)"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Select
                  label={<Text c={"dimmed"}>Main Demographics</Text>}
                  placeholder={"Select Main Demographics"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Select
                  label={<Text c={"dimmed"}>Sub-demographic(s)</Text>}
                  placeholder={"Select Sub-demographic(s)"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Select
                  label={<Text c={"dimmed"}>Status</Text>}
                  placeholder={"All"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <ProfilePieChart />
            </Grid.Col>
            <Grid.Col span={5}>
              <ProfileDataCard />
            </Grid.Col>
          </Grid>
        </Card>
        <Card shadow={"md"} bg={"#DDE5FF"} radius={"md"}>
          <Box mb={10}>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#4E70EA"} size={"sm"}>
                  Promoters vs Detractors
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#4E70EA"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <Select
                  label={<Text c={"dimmed"}>Source(s)</Text>}
                  placeholder={"All"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Group>
                  <Select
                    label={<Text c={"dimmed"}>Year</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                  <Select
                    label={<Text c={"dimmed"}>Month</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <ProfileBarChart />
            </Grid.Col>
          </Grid>
        </Card>
        <Card shadow={"md"} bg={"#DDE5FF"} radius={"md"}>
          <Box mb={10}>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#4E70EA"} size={"sm"}>
                  Hourly Hits
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#4E70EA"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <Select
                  label={<Text c={"dimmed"}>Source(s)</Text>}
                  placeholder={"All"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Group>
                  <Select
                    label={<Text c={"dimmed"}>Year</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                  <Select
                    label={<Text c={"dimmed"}>Month</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <BubbleChart />
            </Grid.Col>
          </Grid>
        </Card>
        <Card shadow={"md"} bg={"#DDE5FF"} radius={"md"}>
          <Box mb={10}>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#4E70EA"} size={"sm"}>
                  Communication Distributions
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#4E70EA"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <Select
                  label={<Text c={"dimmed"}>Source(s)</Text>}
                  placeholder={"All"}
                  data={["Test"]}
                  rightSection={
                    <ActionIcon>
                      <IconChevronDown />
                    </ActionIcon>
                  }
                />
                <Group>
                  <Select
                    label={<Text c={"dimmed"}>Year</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                  <Select
                    label={<Text c={"dimmed"}>Month</Text>}
                    placeholder={"All"}
                    data={["Test"]}
                    rightSection={
                      <ActionIcon>
                        <IconChevronDown />
                      </ActionIcon>
                    }
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <AreaChartSample />
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </Box>
  );
};

export default Root;
