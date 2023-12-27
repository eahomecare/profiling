import {
  Card,
  createStyles,
  Table,
  ScrollArea,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../../redux/campaignListSlice";

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.blue[1],
    "& th": {
      borderColor: theme.colors.gray[4],
    },
  },
  cell: {
    borderColor: theme.colors.gray[4],
    "&:not(:last-of-type)": {
      marginRight: theme.spacing.xs,
    },
  },
}));

const AllCampaigns = () => {
  const dispatch = useDispatch();
  const campaignState = useSelector((state) => state.campaignListSlice);
  const { classes } = useStyles();

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  if (campaignState.campaignStatus === "loading") {
    return <p>Loading...</p>;
  }
  if (campaignState.campaignStatus === "failed") {
    return <p>Error loading campaigns. Details: {campaignState.error}</p>;
  }

  return (
    <Card>
      <ScrollArea>
        <Table striped highlightOnHover>
          <thead className={classes.header}>
            <tr>
              <th>Campaign Name</th>
              <th>Communication Type</th>
              <th>Total No. of Customers</th>
              <th>Create Campaign Date</th>
              <th>Event Date</th>
              <th>Campaign Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaignState.campaigns && campaignState.campaigns.length > 0 ? (
              campaignState.campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className={classes.cell}>{campaign.name}</td>
                  <td className={classes.cell}>{campaign.type}</td>
                  <td className={classes.cell}>{campaign.customers.length}</td>
                  <td className={classes.cell}>
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                  <td className={classes.cell}>
                    {new Date(campaign.end).toLocaleDateString()}
                  </td>
                  <td className={classes.cell}>{campaign.status}</td>
                  <td className={classes.cell}>
                    {campaign.status !== "Closed" && (
                      <>
                        <Flex>
                          <ActionIcon c="lightblue">
                            <IconEdit />
                          </ActionIcon>
                          <ActionIcon c="red">
                            <IconTrash />
                          </ActionIcon>
                        </Flex>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No campaigns available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default AllCampaigns;
