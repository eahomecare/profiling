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
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowRight,
  IconChevronDown,
  IconTableExport,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StyledSelect from "../../StyledComponents/StyledSelect";
import AreaChartSample from "./AreaChart";
import BubbleChart from "./BubbleChart";
import ProfilePieChart from "./PofilePieChart";
import ProfileBarChart from "./ProfileBarChart";
import ProfileDataCard from "./ProfileDataCard";

const Root = () => {
  const theme = useMantineTheme();
  return (
    <Box>
      <Stack>
        {/* First Card */}
        <Card shadow={"lg"} radius={"md"}>
          <Box>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#5C00F2"} size={"sm"}>
                  Profile
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#5C00F2"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={4}>
              <Stack>
                <StyledSelect
                  label={"Profile"}
                  placeholder={"Select Profile(s)"}
                  data={["Test", "Hello", "World"]}
                />
                <StyledSelect
                  label={"Main Demographics"}
                  placeholder={"Select Main Demographics"}
                  data={["Test"]}
                />
                <StyledSelect
                  label={"Sub-demographic(s)"}
                  placeholder={"Select Sub-demographic(s)"}
                  data={["Test"]}
                />
                <StyledSelect
                  label={"Status"}
                  placeholder={"All"}
                  data={["Test"]}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
              <ProfilePieChart />
            </Grid.Col>
            <Grid.Col span={3}>
              <ProfileDataCard />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Fourth Card */}
        <Card shadow={"md"} radius={"md"}>
          <Box>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#5C00F2"} size={"sm"}>
                  Customer vs Profile
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#5C00F2"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <StyledSelect
                  label={"Source(s)"}
                  placeholder={"All"}
                  data={["Test"]}
                />
                <Group>
                  <StyledSelect
                    label={"Year"}
                    placeholder={"All"}
                    data={["Test"]}
                  />
                  <StyledSelect
                    label={"Month"}
                    placeholder={"All"}
                    data={["Test"]}
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <AreaChartSample />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Second Card */}
        <Card shadow={"md"} radius={"md"}>
          <Box>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#5C00F2"} size={"sm"}>
                  Promoters vs Detractors
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#5C00F2"} size={"sm"}>
                    <IconArrowRight />
                  </ActionIcon>
                </Link>
              </Center>
            </Flex>
          </Box>
          <Grid grow>
            <Grid.Col span={3}>
              <Stack>
                <StyledSelect
                  label={"Source(s)"}
                  placeholder={"All"}
                  data={["Test"]}
                />
                <Group>
                  <StyledSelect
                    label={"Year"}
                    placeholder={"All"}
                    data={["Test"]}
                  />
                  <StyledSelect
                    label={"Month"}
                    placeholder={"All"}
                    data={["Test"]}
                  />
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
              <ProfileBarChart />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Third Card */}
        {/* <Card shadow={"md"} radius={"md"}> */}
        {/*   <Box> */}
        {/*     <Flex justify={"space-between"}> */}
        {/*       <Center> */}
        {/*         <Text fw={"bold"} c={"#5C00F2"} size={"sm"}> */}
        {/*           Hourly Hits */}
        {/*         </Text> */}
        {/*       </Center> */}
        {/*       <Center> */}
        {/*         <Link to={"/campaign"}> */}
        {/*           <ActionIcon c={"#5C00F2"} size={"sm"}> */}
        {/*             <IconArrowRight /> */}
        {/*           </ActionIcon> */}
        {/*         </Link> */}
        {/*       </Center> */}
        {/*     </Flex> */}
        {/*   </Box> */}
        {/*   <Grid grow> */}
        {/*     <Grid.Col span={3}> */}
        {/*       <Stack> */}
        {/*         <StyledSelect */}
        {/*           label={"Source(s)"} */}
        {/*           placeholder={"All"} */}
        {/*           data={["Test"]} */}
        {/*         /> */}
        {/*         <Group> */}
        {/*           <StyledSelect */}
        {/*             label={"Year"} */}
        {/*             placeholder={"All"} */}
        {/*             data={["Test"]} */}
        {/*           /> */}
        {/*           <StyledSelect */}
        {/*             label={"Month"} */}
        {/*             placeholder={"All"} */}
        {/*             data={["Test"]} */}
        {/*           /> */}
        {/*         </Group> */}
        {/*       </Stack> */}
        {/*     </Grid.Col> */}
        {/*     <Grid.Col span={9}> */}
        {/*       <BubbleChart /> */}
        {/*     </Grid.Col> */}
        {/*   </Grid> */}
        {/* </Card> */}
      </Stack>
    </Box>
  );
};

export default Root;
