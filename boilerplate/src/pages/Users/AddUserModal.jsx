import React from "react";
import {
  Modal,
  Text,
  Select,
  Button,
  TextInput,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

const AddUserModal = ({
  isModalOpen,
  handleModalClose,
  handleAddUser,
  userDetails,
  setUserDetails,
  rolesData,
}) => {
  return (
    <Modal
      opened={isModalOpen}
      onClose={handleModalClose}
      title="Create User"
      style={{ content: { maxHeight: "80vh" } }}
    >
      <SimpleGrid cols={2}>
        <TextInput
          placeholder="First Name"
          label="First Name"
          value={userDetails.firstname}
          onChange={(event) =>
            setUserDetails({ ...userDetails, firstname: event.target.value })
          }
          withAsterisk
          required
        />

        <TextInput
          placeholder="Last Name"
          label="Last Name"
          value={userDetails.lastname}
          onChange={(event) =>
            setUserDetails({ ...userDetails, lastname: event.target.value })
          }
          withAsterisk
        />
      </SimpleGrid>

      <TextInput
        placeholder="Email"
        label="Email"
        value={userDetails.email}
        onChange={(event) =>
          setUserDetails({ ...userDetails, email: event.target.value })
        }
        withAsterisk
        required
        type="email"
      />

      <TextInput
        placeholder="Mobile"
        label="Mobile"
        value={userDetails.mobile}
        withAsterisk
        onChange={(event) =>
          setUserDetails({ ...userDetails, mobile: event.target.value })
        }
      />

      <TextInput
        placeholder="Address"
        label="Address"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <TextInput
        placeholder="Pincode"
        label="Pincode"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <DateInput
        placeholder={"Date Of Birth"}
        label={"Date Of Birth"}
        rightSection={
          <ActionIcon variant={"subtle"}>
            <IconCalendar />
          </ActionIcon>
        }
        withAsterisk
        maxDate={new Date()}
      />

      <Select
        label="Role"
        placeholder="Select Role"
        data={rolesData}
        value={userDetails.role}
        onChange={(value) => setUserDetails({ ...userDetails, role: value })}
        withAsterisk
        required
      />

      <Button
        className="mt-4"
        style={{
          backgroundColor: !(
            !userDetails.firstname ||
            !userDetails.lastname ||
            !userDetails.email ||
            !userDetails.role
          )
            ? "#4E70EA"
            : "grey",
        }}
        onClick={handleAddUser}
        disabled={
          !userDetails.firstname ||
          !userDetails.lastname ||
          !userDetails.email ||
          !userDetails.role
        }
      >
        Submit
      </Button>
    </Modal>
  );
};

export default AddUserModal;
