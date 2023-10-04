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
import StyledTextInput from "../../StyledComponents/StyledTextInput";
import StyledDateInput from "../../StyledComponents/StyledDateInput";
import StyledSelect from "../../StyledComponents/StyledSelect";
import StyledButton from "../../StyledComponents/StyledButton";

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
        <StyledTextInput
          placeholder="First Name"
          label="First Name"
          value={userDetails.firstname}
          onChange={(event) =>
            setUserDetails({ ...userDetails, firstname: event.target.value })
          }
          withAsterisk
          required
        />

        <StyledTextInput
          placeholder="Last Name"
          label="Last Name"
          value={userDetails.lastname}
          onChange={(event) =>
            setUserDetails({ ...userDetails, lastname: event.target.value })
          }
          withAsterisk
        />
      </SimpleGrid>

      <StyledTextInput
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

      <StyledTextInput
        placeholder="Mobile"
        label="Mobile"
        value={userDetails.mobile}
        withAsterisk
        onChange={(event) =>
          setUserDetails({ ...userDetails, mobile: event.target.value })
        }
      />

      <StyledTextInput
        placeholder="State"
        label="State"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <StyledTextInput
        placeholder="City"
        label="City"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <StyledTextInput
        placeholder="Address"
        label="Address"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <StyledTextInput
        placeholder="Pincode"
        label="Pincode"
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
      />

      <StyledDateInput
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

      <StyledSelect
        label="Role"
        placeholder="Select Role"
        data={rolesData}
        value={userDetails.role}
        onChange={(value) => setUserDetails({ ...userDetails, role: value })}
        withAsterisk
        required
      />

      <StyledButton
        className="mt-4"
        // style={{
        //   backgroundColor: !(
        //     !userDetails.firstname ||
        //     !userDetails.lastname ||
        //     !userDetails.email ||
        //     !userDetails.role
        //   )
        //     ? "#4E70EA"
        //     : "grey",
        // }}
        onClick={handleAddUser}
        disabled={
          !userDetails.firstname ||
          !userDetails.lastname ||
          !userDetails.email ||
          !userDetails.role
        }
      >
        Submit
      </StyledButton>
    </Modal>
  );
};

export default AddUserModal;
