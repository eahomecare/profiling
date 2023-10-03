import {
  ActionIcon,
  Button,
  createStyles,
  Flex,
  LoadingOverlay,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, getUsers } from "../../redux/authSlice";
import {
  getAllPermissions,
  getAllRoles,
  getAllRolesPermissionsMappings,
} from "../../redux/rolesPermissionSlice";
import StyledButton from "../../StyledComponents/StyledButton";
import StyledTable from "../../StyledComponents/StyledTable";
import UserActionModal from "./UserActionModal";

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

const Users = () => {
  const useStyles = createStyles((theme) => ({
    header: {
      position: "sticky",
      top: 0,
      backgroundColor: "#4E70EA",
      fontColor: "red",
      transition: "box-shadow 150ms ease",

      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        borderBottom: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[3]
            : theme.colors.gray[2]
        }`,
      },
    },

    scrolled: {
      boxShadow: theme.shadows.sm,
    },
  }));

  const { classes, cx } = useStyles();
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

  const allUserIds = users?.map((user) => user.id) || [];

  for (const userId of allUserIds) {
    if (!userPermissionsDict.hasOwnProperty(userId)) {
      userPermissionsDict[userId] = [];
    }
  }

  const handleUserActionModal = (selected_user) => {
    setCurrUser(selected_user);
    setUserActionModalOpen(true);
  };

  useEffect(() => {
    dispatch(getAllRolesPermissionsMappings());
    dispatch(getUsers());
    dispatch(getAllPermissions());
    dispatch(getAllRoles());
  }, []);

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

  const initialData =
    Object.keys(userPermissionsDict).length > 0
      ? users.map((data) => ({
          id: data.id,
          roleId: data.roleId,
          email: data.email,
          isactive: "active",
          role: data.role.name,
          created_at: formatDate(data.created_at),
        }))
      : [];

  const columns = [
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Status",
      accessorKey: "isactive",
      Cell: ({ value }) => (
        <Button color="teal" size="xs" compact>
          {value}
        </Button>
      ),
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
          if (column.id === "action") {
            handleUserActionModal(row.original);
          }
        };

        return (
          <ActionIcon variant="light" onClick={handleActionClick}>
            <IconSettings size="1rem" />
          </ActionIcon>
        );
      },
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
    console.log("hi");
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
    } catch (error) {
      console.log(error);
    }
  };

  if (!users || users.length === 0) {
    return (
      <LoadingOverlay
        visible
        overlayBlur={2}
        overlayColor={"#EBDFFF"}
        loaderProps={{
          color: "#5C0FF2",
          size: "xl",
          variant: "dots",
        }}
      />
    );
  } else {
    return (
      <>
        <StyledTable
          columns={columns}
          data={initialData}
          onRowClick={(row) => console.log("Row clicked:", row)}
          topProps={() => (
            <Flex>
              <StyledButton compact onClick={handleAddUserModal}>
                + Create User
              </StyledButton>
            </Flex>
          )}
        />
        {isUserActionModalOpen && (
          <UserActionModal
            isModalOpen={isUserActionModalOpen}
            handleModalClose={handleModalClose}
            curr_user={curr_user}
            userRolesPermissions={userRolesPermissions}
            userPermissionsOptions={userPermissionsOptions}
            classes={classes}
            cx={cx}
          />
        )}
      </>
    );
  }
};

export default Users;
