import {
  Modal,
  useMantineTheme,
  Title,
  Button,
  Avatar,
  Text,
  Grid,
  Timeline,
  Space,
  Table,
  Select,
} from "@mantine/core";
import { IconGitBranch, IconGitCommit } from "@tabler/icons-react";
import { useState } from "react";
import { Switch } from "@mantine/core";
import {
  createRolesPermissionMapping,
  getAllRolesPermissionsMappings,
  deactivateMapping,
} from "../../redux/rolesPermissionSlice";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";

function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function showNotification(prop) {
  notifications.show({
    title: "Success",
    message: prop,
    styles: (theme) => ({
      root: {
        backgroundColor: "#4E70EA",
        borderColor: theme.colors.blue[6],

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.white },
      description: { color: theme.white },
      closeButton: {
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.blue[7] },
      },
    }),
  });
}

const UserActionModal = ({
  isModalOpen,
  curr_user,
  handleModalClose,
  userRolesPermissions,
  userPermissionsOptions,
  classes,
  cx,
}) => {
  const initialData =
    Object.keys(userRolesPermissions).length > 0
      ? userRolesPermissions.map((data) => ({
        id: data.id,
        permission: data.permission.name,
        isactive: data.isActive ? "active" : "disabled",
        created_at: formatDate(data.created_at),
      }))
      : [];
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState(initialData);
  const [scrolled, setScrolled] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const deactivateMappingOnClick = (id) => {
    dispatch(deactivateMapping(id));
    dispatch(getAllRolesPermissionsMappings());
    showNotification("changed status successfully");
    handleModalClose();
  };

  const rows = Array.isArray(tableData)
    ? tableData.map((row) => (
      <tr key={row.id}>
        <td>
          {row.permission ? (
            row.permission
          ) : (
            <Select
              label="Permission"
              placeholder="Select Permission"
              data={userPermissionsOptions}
              value={selectedPermission}
              onChange={(value) => setSelectedPermission(value)}
              withAsterisk
              required
            />
          )}
        </td>
        <td>
          <Switch
            onClick={() => deactivateMappingOnClick(row.id)}
            checked={row.isactive == "active"}
            color="teal"
            onLabel="ACTIVE"
            offLabel="DISABLE"
          />
        </td>
        <td>{row.created_at}</td>
      </tr>
    ))
    : [];

  const addRow = () => {
    const newRow = {
      id: Math.random(), // generate a random id
      permission: "",
      isactive: "active",
      created_at: formatDate(new Date()),
    };
    setTableData([...tableData, newRow]);
    setAdding(true);
  };

  const handleAssignPermission = () => {
    dispatch(
      createRolesPermissionMapping({
        roleId: curr_user.roleId,
        permissionId: selectedPermission,
        userId: curr_user.id,
      }),
    );
    dispatch(getAllRolesPermissionsMappings());
    showNotification("added permission successfully");
    handleModalClose();
  };

  return (
    <>
      {console.log(curr_user)}
      <Modal
        opened={isModalOpen}
        title="User Actions"
        onClose={handleModalClose}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        size={"lg"}
      >
        <Grid>
          <Grid.Col span={2}>
            <Avatar
              src={null}
              alt="no image here"
              color="indigo"
              radius="0"
              size={50}
            />
          </Grid.Col>
          <Grid.Col
            span={5}
            style={{ borderLeft: "1px solid #ccc", borderRadius: "4px" }}
          >
            <Text>
              <Text c="#4E70EA" fw={700}>
                Name1:
              </Text>{" "}
              {curr_user.email}
            </Text>
          </Grid.Col>
          <Grid.Col
            span={5}
            style={{ borderLeft: "1px solid #ccc", borderRadius: "4px" }}
          >
            <Text>
              <Text c="#4E70EA" fw={700}>
                Role:
              </Text>{" "}
              {curr_user.role}
            </Text>
          </Grid.Col>
          <Grid.Col
            span={8}
            style={{ borderLeft: "1px solid #ccc", borderRadius: "4px" }}
          >
            <Text>
              <Text c="#4E70EA" fw={700}>
                Address:
              </Text>{" "}
              123/street,Lorem ipsume Lorem ipsumeLorem ipsume
            </Text>
          </Grid.Col>
          <Grid.Col
            span={4}
            style={{ borderLeft: "1px solid #ccc", borderRadius: "4px" }}
          >
            <Text>
              <Text c="#4E70EA" fw={700}>
                Mobile:
              </Text>{" "}
              987654321
            </Text>
          </Grid.Col>
        </Grid>

        <Grid>
          {/* <Grid.Col span={8}>
            <Space h="xl" />
            <Title order={4} c="#4E70EA">
              User Permissions
            </Title>
            <Space h="xl" />
            <Table
              miw={300}
              striped
              withBorder
              highlightOnHover
              withColumnBorders
            >
              <thead
                className={cx(classes.header, { [classes.scrolled]: scrolled })}
              >
                <tr>
                  <th>
                    <Text color="white">Permission</Text>{" "}
                  </th>
                  <th>
                    <Text color="white">Status</Text>
                  </th>
                  <th>
                    <Text color="white">Created At</Text>{" "}
                  </th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
            <Space h="xl" />
            {!adding && (
              <Button
                style={{ backgroundColor: "black", fontColor: "white" }}
                onClick={addRow}
              >
                Add Permission
              </Button>
            )}
            {adding && (
              <Button color="teal" onClick={handleAssignPermission}>
                Save
              </Button>
            )}
          </Grid.Col> */}
          <Grid.Col span={12}>
            <Space h="xl" />
            <Title order={4} c="#4E70EA">
              User activity
            </Title>
            <Space h="xl" />
            <Timeline active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconGitBranch size={12} />}
                title="User Created"
              >
                <Text color="dimmed" size="sm">
                  {curr_user.email}&apos; created at {formatDate(new Date())}{" "}
                  <Text variant="link" component="span" inherit></Text>
                </Text>
                <Text size="xs" mt={4}>
                  2 hours ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconGitCommit size={12} />}
                title="Created Camapign"
              >
                <Text color="dimmed" size="sm">
                  {curr_user.email}&apos; created new campaign
                  <Text variant="link" component="span" inherit></Text>
                </Text>
                <Text size="xs" mt={4}>
                  52 minutes ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                bullet={<IconGitCommit size={12} />}
                title="Closed Camapign"
              >
                <Text color="dimmed" size="sm">
                  {curr_user.email}&apos; closed new campaign
                  <Text variant="link" component="span" inherit></Text>
                </Text>
                <Text size="xs" mt={4}>
                  52 minutes ago
                </Text>
              </Timeline.Item>
            </Timeline>
          </Grid.Col>
        </Grid>
      </Modal >
    </>
  );
};

export default UserActionModal;
