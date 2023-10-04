import { ActionIcon, Flex, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import StyledButton from "../../StyledComponents/StyledButton";
import StyledTable from "../../StyledComponents/StyledTable";

function Permissions({ initialData, title }) {
  const permissionsData = initialData.map((row) => ({
    id: row.id,
    name: row.name,
    isactive: row.isactive,
    created_at: row.created_at,
  }));

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Status",
      accessorKey: "isactive",
      Cell: ({ value }) => (
        <StyledButton w={80} c="teal" size="xs" compact>
          {value}
        </StyledButton>
      ),
    },
    {
      header: "Created At",
      accessorKey: "created_at",
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   Cell: () => {
    //     const handleActionClick = () => {
    //       console.log("Icon in the Action column clicked!");
    //     };
    //
    //     return (
    //       <ActionIcon variant="light" onClick={handleActionClick}>
    //         <IconSettings size="1rem" />
    //       </ActionIcon>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Title style={{ padding: "10px" }} order={4} color="blue.5">
        {title}
      </Title>
      <StyledTable
        columns={columns}
        data={permissionsData}
        onRowClick={(row) => console.log("Row clicked:", row)}
        // topProps={() => (
        //   <Flex>
        //     <StyledButton
        //       compact
        //       onClick={() => {
        //         console.log("Create Permission clicked!");
        //       }}
        //     >
        //       Create Permission
        //     </StyledButton>
        //   </Flex>
        // )}
      />
    </>
  );
}

export default Permissions;
