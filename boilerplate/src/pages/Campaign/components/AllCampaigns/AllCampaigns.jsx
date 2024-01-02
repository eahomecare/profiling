import { ActionIcon, Flex } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../../redux/campaignListSlice";
import StyledTable from "../../../../StyledComponents/StyledTable";

const AllCampaigns = () => {
  const dispatch = useDispatch();
  const campaignState = useSelector((state) => state.campaignListSlice);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Campaign Name",
      },
      {
        accessorKey: "type",
        header: "Communication Type",
      },
      {
        accessorKey: "customers",
        header: "Total No. of Customers",
        accessorFn: (row) => row.customers.length,
      },
      {
        accessorKey: "created_at",
        header: "Create Campaign Date",
        accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
      },
      {
        accessorKey: "end",
        header: "Event Date",
        accessorFn: (row) => new Date(row.end).toLocaleDateString(),
      },
      {
        accessorKey: "status",
        header: "Campaign Status",
      },
      {
        accessorKey: "actions",
        header: "Action",
        Cell: ({ row }) => (
          <Flex>
            <ActionIcon color="lightblue">
              <IconEdit />
            </ActionIcon>
            <ActionIcon color="red">
              <IconTrash />
            </ActionIcon>
          </Flex>
        ),
      },
    ],
    [],
  );

  if (campaignState.campaignStatus === "loading") {
    return <p>Loading...</p>;
  }
  if (campaignState.campaignStatus === "failed") {
    return <p>Error loading campaigns. Details: {campaignState.error}</p>;
  }
  const reversedData = [...campaignState.campaigns].reverse();
  const handleRowClick = () => {
    console.log("Row clicked");
  };

  return (
    <StyledTable
      columns={columns}
      data={reversedData}
      onRowClick={handleRowClick}
    />
  );
};

export default AllCampaigns;
