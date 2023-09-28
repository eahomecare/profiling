import { Box, Grid } from "@mantine/core";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";

const MyAccount = () => {
  return (
    <Box>
      <Grid>
        <Grid.Col span={5}>
          <MyProfile />
        </Grid.Col>
        <Grid.Col span={7}>
          <EditProfile />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default MyAccount;
