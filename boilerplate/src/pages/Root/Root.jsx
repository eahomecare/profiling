import {
  ActionIcon,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StyledSelect from "../../StyledComponents/StyledSelect";
import AreaChartSample from "./AreaChart";
import CustomerProfileAnalysis from "./CustomerProfileAnalysis";
import ProfileBarChart from "./ProfileBarChart";
import ProfileTypeAnalysis from "./ProfileTypeAnalysis";

const Root = () => {
  return (
    <Box>
      <Stack>
        {/* First Card */}
        <ProfileTypeAnalysis />

        {/* Second Card */}
        <CustomerProfileAnalysis />

        {/* Third Card */}
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
