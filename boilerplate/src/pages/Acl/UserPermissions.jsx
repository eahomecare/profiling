import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Flex,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/authSlice";
import { getAllRolesPermissionsMappings } from "../../redux/rolesPermissionSlice";
import StyledButton from "../../StyledComponents/StyledButton";
import StyledTable from "../../StyledComponents/StyledTable";
import AddUserModal from "./AddUserModal";
import UserActionModal from "./UserActionModal";

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

const UserPermissions = ({ initialData }) => {
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isUserActionModalOpen, setUserActionModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { rolesPermissions, roles, permissions } = useSelector(
    (state) => state.rolePermission,
  );
  const { users } = useSelector((state) => state.auth);
  const userPermissionsDict = {};
  const [userDetails, setUserDetails] = useState({
    firstname: null,
    lastname: null,
    email: null,
    role: null,
    mobile: null,
  });
  const [curr_user, setCurrUser] = useState(null);

  for (const permission of rolesPermissions) {
    const {
      userId,
      permission: { name },
    } = permission;

    if (userPermissionsDict.hasOwnProperty(userId)) {
      userPermissionsDict[userId].push(name);
    } else {
      userPermissionsDict[userId] = [name];
    }
  }

  const allUserIds = users.map((user) => user.id);

  for (const userId of allUserIds) {
    if (!userPermissionsDict.hasOwnProperty(userId)) {
      userPermissionsDict[userId] = [];
    }
  }

  const handleUserActionModal = (selected_user) => {
    setCurrUser(selected_user);
    setUserActionModalOpen(true);
  };

  const userRolesPermissions =
    curr_user &&
    rolesPermissions.filter((item) => item.userId === curr_user.id);

  const userPermissionsOptions = [];
  if (curr_user) {
    permissions.map((data) => {
      if (!userPermissionsDict[curr_user.id].includes(data.name)) {
        userPermissionsOptions.push({ value: data.id, label: data.name });
      }
    });
  }

  const columns = [
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
    { header: "Permissions", accessorKey: "permissions" },
    {
      header: "Status",
      accessorKey: "isactive",
      Cell: ({ value }) => (
        <Button color="teal" size="xs" compact>
          {value}
        </Button>
      ),
    },
    { header: "Created At", accessorKey: "created_at" },
    {
      header: "Action",
      accessorKey: "action",
      Cell: ({ row }) => (
        <ActionIcon variant="light" onClick={() => handleUserActionModal(row)}>
          <IconSettings size="1rem" />
        </ActionIcon>
      ),
    },
  ];

  const rolesData =
    roles &&
    Array.isArray(roles) &&
    roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));

  const handleModalClose = () => {
    if (isAddUserModalOpen) setAddUserModalOpen(false);
    if (isUserActionModalOpen) setUserActionModalOpen(false);
  };

  const handleAddUserModal = () => {
    setAddUserModalOpen(true);
  };

  const handleAddUser = async () => {
    try {
      const userData = {
        email: userDetails.email,
        mobile: userDetails.mobile,
        fullname: `${userDetails.firstname} ${userDetails.lastname}`,
        roleId: userDetails.role,
      };
      await dispatch(addUser(userData));
      await dispatch(getAllRolesPermissionsMappings());
      setAddUserModalOpen(false);
      showNotification("added user successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (!users || users.length === 0) {
    return (
      <LoadingOverlay
        visible
        overlayBlur={2}
        loaderProps={{
          size: "xl",
          variant: "dots",
        }}
      />
    );
  } else {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "#DDE5FF",
            padding: "50px",
            marginTop: "-80px",
          }}
        >
          <div style={{ display: "flex" }}>
            <span style={{ flexGrow: "1", width: "100px" }}>
              <div style={{ padding: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    marginTop: "-65px",
                  }}
                >
                  <span style={{ padding: "10px" }}>
                    <Title pl={5}>Users Permisssions</Title>
                  </span>
                  <span>
                    <Container>
                      <Center>
                        <Flex mt={5}>
                          <StyledButton
                            className="mt-4"
                            onClick={handleAddUserModal}
                            style={{
                              backgroundColor: "black",
                              fontColor: "white",
                            }}
                          >
                            + Create User
                          </StyledButton>
                          <AddUserModal
                            isModalOpen={isAddUserModalOpen}
                            handleAddUser={handleAddUser}
                            handleModalClose={handleModalClose}
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                            rolesData={rolesData}
                          />
                        </Flex>
                      </Center>
                    </Container>
                  </span>
                </div>

                {isUserActionModalOpen && (
                  <UserActionModal
                    isModalOpen={isUserActionModalOpen}
                    handleModalClose={handleModalClose}
                    curr_user={curr_user}
                    userRolesPermissions={userRolesPermissions}
                    userPermissionsOptions={userPermissionsOptions}
                  />
                )}

                <StyledTable
                  columns={columns}
                  data={initialData}
                  onRowClick={(row) => console.log("Row clicked:", row)}
                />
              </div>
            </span>
          </div>
        </Box>
      </>
    );
  }
};

export default UserPermissions;
