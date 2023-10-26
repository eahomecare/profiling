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
import BarStackedView from "../HomeDashBoard/BarStackedCampaign";
import AreaChartSample from "./AreaChart";
import CustomerProfileAnalysis from "./CustomerProfileAnalysis";
import ProfileAnalysis from "./ProfileAnalysis";
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
        <ProfileAnalysis />

        {/* Fourth Card */}
        <Card shadow={"md"} radius={"md"}>
          <Box>
            <Flex justify={"space-between"}>
              <Center>
                <Text fw={"bold"} c={"#2B1DFD"} size={"sm"}>
                  Promoters vs Detractors
                </Text>
              </Center>
              <Center>
                <Link to={"/campaign"}>
                  <ActionIcon c={"#2B1DFD"} size={"sm"}>
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

        {/* Fourth Card */}
        <Card shadow={"md"} radius={"md"}>
          <BarStackedView />
        </Card>

        {/* Third Card */}
        {/* <Card shadow={"md"} radius={"md"}> */}
        {/*   <Box> */}
        {/*     <Flex justify={"space-between"}> */}
        {/*       <Center> */}
        {/*         <Text fw={"bold"} c={"#2B1DFD"} size={"sm"}> */}
        {/*           Hourly Hits */}
        {/*         </Text> */}
        {/*       </Center> */}
        {/*       <Center> */}
        {/*         <Link to={"/campaign"}> */}
        {/*           <ActionIcon c={"#2B1DFD"} size={"sm"}> */}
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
