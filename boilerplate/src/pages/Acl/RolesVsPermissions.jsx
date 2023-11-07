import { ActionIcon, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import StyledTable from "../../StyledComponents/StyledTable";

const RolesVsPermissions = ({ initialData, title }) => {
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Permissions",
      accessorKey: "permissions",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
    },
    {
      header: "Action",
      accessorKey: "action",
      Cell: ({ row, column }) => {
        const handleActionClick = (e) => {
          e.preventDefault();
          console.log(`Clicked action for ID: ${row.original.id}`);
        };

        return (
          <ActionIcon variant="light" onClick={handleActionClick}>
            <IconSettings size="1rem" />
          </ActionIcon>
        );
      },
    },
  ];

  return (
    <>
      <Title style={{ padding: "10px" }} order={4} color="#0d5ff9">
        {title}
      </Title>
      <StyledTable
        columns={columns}
        data={initialData}
        onRowClick={(row) => console.log("Row clicked:", row)}
      />
    </>
  );
};

export default RolesVsPermissions;
