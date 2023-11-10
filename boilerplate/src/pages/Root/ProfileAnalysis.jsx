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
import { useState } from "react";
import { Link } from "react-router-dom";
import StyledSelect from "../../StyledComponents/StyledSelect";
import ProfileAnalysisBarChart from "./ProfileAnalysisBarChart";

const ProfileAnalysis = () => {
  const [selectedSource, setSelectedSource] = useState("All");
  return (
    <Card shadow={"md"} radius={"md"}>
      <Box>
        <Flex justify={"space-between"}>
          <Center>
            <Text fw={"bold"} c={"#0d5ff9"} size={"sm"}>
              Profile Analysis
            </Text>
          </Center>
          <Center>
            {/* <Link to={"/campaign"}> */}
            <ActionIcon c={"#0d5ff9"} size={"sm"}>
              <IconArrowRight />
            </ActionIcon>
            {/* </Link> */}
          </Center>
        </Flex>
      </Box>
      <Grid grow>
        <Grid.Col span={3}>
          <Stack>
            <StyledSelect
              label={"Source(s)"}
              placeholder={"All"}
              data={["All", "Call", "homecare", "eportal"]}
              value={selectedSource}
              onChange={setSelectedSource}
            />
            {/* <Group>
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
            </Group> */}
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <ProfileAnalysisBarChart source={selectedSource} />
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ProfileAnalysis;
