import {
  ActionIcon,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconTableExport } from "@tabler/icons-react";
import CustomPieChart from "./PieChart";
import VerticalBarChart from "./VerticalBarChart";
import TopPanelCards from "./TopPanelCards";
import BarStackedView from "./BarStackedCampaign";
import { Link } from "react-router-dom";

const BoardStats = () => {
  return (
    <>
      <Stack>
        <Title>Campaign</Title>
        {/* Pannel 1 */}
        <Card shadow="lg" radius={"lg"} bg={"#DDE5FF"}>
          <Flex c={"#4E70EA"} justify={"space-between"}>
            <Text fw={"bold"}>General</Text>
            <Center>
              <ActionIcon c={"#4E70EA"}>
                <IconTableExport />
              </ActionIcon>
              <Text fw={"bold"}>Export</Text>
            </Center>
          </Flex>
          <SimpleGrid cols={4}>
            <TopPanelCards />
          </SimpleGrid>
        </Card>
        {/* Pannel 1 End */}
        <Grid grow>
          <Grid.Col span={4}>
            {/* Mid Pannel Left Start */}
            <Card shadow="lg" radius={"lg"} h={"100%"} bg={"#DDE5FF"}>
              <Stack>
                <Flex c={"#4E70EA"} justify={"space-between"}>
                  <Text fw={"bold"}>Overview</Text>
                  <Center>
                    <ActionIcon c={"#4E70EA"}>
                      <IconTableExport />
                    </ActionIcon>
                    <Text fw={"bold"}>Export</Text>
                  </Center>
                </Flex>
                <Group grow>
                  <Box>
                    <Stack>
                      <Select
                        label={<Text c={"dimmed"}>Source(s)</Text>}
                        placeholder="All"
                        rightSection={<IconChevronDown size="1rem" />}
                        rightSectionWidth={30}
                        styles={{ rightSection: { pointerEvents: "none" } }}
                        data={[
                          "All",
                          "Homecare",
                          "E-Portal 2.0",
                          "EZ-Auto",
                          "Cyberior",
                        ]}
                      />
                      <Card withBorder>
                        <Stack>
                          <Group spacing={"xs"}>
                            <Title size={"md"}>Total</Title>
                            <Title size={"md"} c={"blue"}>
                              16,954
                            </Title>
                          </Group>
                          <Flex justify={"space-between"}>
                            <Text c={"red"} fw={"bold"}>
                              • SMS
                            </Text>
                            <Text>1244</Text>
                          </Flex>
                          <Flex justify={"space-between"}>
                            <Text c={"yellow"} fw={"bold"}>
                              • Email
                            </Text>
                            <Text>242</Text>
                          </Flex>
                          <Flex justify={"space-between"}>
                            <Text c={"blue"} fw={"bold"}>
                              • Notification
                            </Text>
                            <Text>2345</Text>
                          </Flex>
                          <Flex justify={"space-between"}>
                            <Text c={"green"} fw={"bold"}>
                              • Whatsapp
                            </Text>
                            <Text>13123</Text>
                          </Flex>
                        </Stack>
                      </Card>
                    </Stack>
                  </Box>
                  <Box>
                    <CustomPieChart />
                  </Box>
                </Group>
              </Stack>
            </Card>
            {/* Mid Pannel Left End */}
          </Grid.Col>
          <Grid.Col span={8}>
            {/* Mid Pannel Right Start */}
            <Card shadow="lg" radius={"lg"} bg={"#DDE5FF"}>
              <Stack>
                <Flex c={"#4E70EA"} justify={"space-between"}>
                  <Text fw={"bold"}>Communications</Text>
                  <Center>
                    <ActionIcon c={"#4E70EA"}>
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
            {/* Mid Pannel Right End */}
          </Grid.Col>
        </Grid>
        {/* <Card shadow="md" mb={10} h={600} bg={"#DDE5FF"} radius={"md"}> */}
        {/*   <BarStackedView /> */}
        {/* </Card> */}
      </Stack>
    </>
  );
};

export default BoardStats;
