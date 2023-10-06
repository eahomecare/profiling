import {
  ActionIcon,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconTableExport } from "@tabler/icons-react";
import CustomPieChart from "./PieChart";
import VerticalBarChart from "./VerticalBarChart";
import TopPanelCards from "./TopPanelCards";
import StyledSelect from "../../StyledComponents/StyledSelect";
import RadialChart from "./RadialChart";

const BoardStats = () => {
  return (
    <>
      <Stack>
        {/* <Title>Campaign</Title> */}
        {/* Pannel 1 */}
        <Card shadow="lg" radius={"lg"}>
          <Flex c={"#5C00F2"} justify={"space-between"}>
            <Text fw={"bold"}>General</Text>
          </Flex>
          <SimpleGrid cols={5}>
            <TopPanelCards />
          </SimpleGrid>
        </Card>
        {/* Pannel 1 End */}
        {/* Mid Pannel Left Start */}
        <Grid>
          <Grid.Col span={6}>
            <Card shadow="lg" radius={"lg"} h={"100%"}>
              <Flex c={"#5C00F2"} justify={"space-between"}>
                <Text fw={"bold"}>Overview</Text>
                <Center>
                  <ActionIcon c={"#5C00F2"}>
                    <IconTableExport />
                  </ActionIcon>
                  <Text fw={"bold"}>Export</Text>
                </Center>
              </Flex>
              <Stack>
                <Group grow>
                  <Card sx={{ border: "1px solid", borderColor: "#EBDFFF" }}>
                    <Stack>
                      <Group spacing={"xs"}>
                        <Title size={"md"}>Total</Title>
                        <Title size={"md"} c={"#5C00F2"}>
                          16,954
                        </Title>
                      </Group>
                      <Flex justify={"space-between"}>
                        <Text c={"#DE8965"} fw={"bold"}>
                          • SMS
                        </Text>
                        <Text>1244</Text>
                      </Flex>
                      <Flex justify={"space-between"}>
                        <Text c={"#D85972"} fw={"bold"}>
                          • Email
                        </Text>
                        <Text>242</Text>
                      </Flex>
                      <Flex justify={"space-between"}>
                        <Text c={"#2745D9"} fw={"bold"}>
                          • Notification
                        </Text>
                        <Text>2345</Text>
                      </Flex>
                      <Flex justify={"space-between"}>
                        <Text c={"#1D9825"} fw={"bold"}>
                          • Whatsapp
                        </Text>
                        <Text>13123</Text>
                      </Flex>
                    </Stack>
                  </Card>
                  <Box>
                    <CustomPieChart />
                  </Box>
                </Group>
                <Stack>
                  <StyledSelect
                    label={"Category"}
                    placeholder="Demographic"
                    data={["Demographic"]}
                  />
                  <StyledSelect
                    label={"Sub-Category(s)"}
                    placeholder="Age"
                    data={["Age"]}
                  />
                  <StyledSelect
                    label={"Status"}
                    placeholder="All"
                    data={["All"]}
                  />
                </Stack>
              </Stack>
            </Card>
            {/* </Grid.Col> */}
            {/* <Grid.Col span={6}> */}
            {/* <Card shadow="lg" radius={"lg"} h={"100%"}> */}
            {/*   <Flex c={"#5C00F2"} justify={"space-between"}> */}
            {/*     <Text fw={"bold"}>Customers vs Profiles</Text> */}
            {/*     <Center> */}
            {/*       <ActionIcon c={"#5C00F2"}> */}
            {/*         <IconTableExport /> */}
            {/*       </ActionIcon> */}
            {/*       <Text fw={"bold"}>Export</Text> */}
            {/*     </Center> */}
            {/*   </Flex> */}
            {/*   <RadialChart /> */}
            {/* </Card> */}
          </Grid.Col>
        </Grid>

        <Card shadow="lg" radius={"lg"}>
          <Stack>
            <Flex c={"#5C00F2"} justify={"space-between"}>
              <Text fw={"bold"}>Communications</Text>
              <Center>
                <ActionIcon c={"#5C00F2"}>
                  <IconTableExport />
                </ActionIcon>
                <Text fw={"bold"}>Export</Text>
              </Center>
            </Flex>
            <Box>
              <VerticalBarChart />
            </Box>
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

export default BoardStats;
