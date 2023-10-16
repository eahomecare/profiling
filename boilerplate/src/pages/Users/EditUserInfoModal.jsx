import React, { useState, useEffect } from "react";
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
import StyledSelect from "../../StyledComponents/StyledSelect";
import StyledButton from "../../StyledComponents/StyledButton";
import StyledDateInput from "../../StyledComponents/StyledDateInput";

const EditUserInfoModal = ({
  isModalOpen,
  handleModalClose,
  handleEditUser,
  userData, // Pass the user data to prepopulate the modal
  rolesData,
}) => {
  // Initialize userDetails with default values if it's null
  const initialUserDetails = userData || {
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    // Add other properties as needed
  };

  const [userDetails, setUserDetails] = useState(initialUserDetails);

  // Ensure userDetails is updated when userData changes
  useEffect(() => {
    setUserDetails(initialUserDetails);
  }, [initialUserDetails]);

  return (
    <Modal
      opened={isModalOpen}
      onClose={handleModalClose}
      title="Edit User"
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
        type={"number"}
        value={userDetails.mobile}
        onChange={(event) =>
          setUserDetails({ ...userDetails, mobile: event.target.value })
        }
        withAsterisk
      />

      <StyledTextInput
        placeholder="Pincode"
        label="Pincode"
        type={"number"}
        // value={userDetails.mobile}
        withAsterisk
        // onChange={(event) =>
        //   setUserDetails({ ...userDetails, mobile: event.target.value })
        // }
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

      <StyledSelect
        label="Role"
        placeholder="Select Role"
        data={rolesData}
        value={userDetails.role}
        onChange={(value) => setUserDetails({ ...userDetails, role: value })}
        withAsterisk
        required
      />
      {/* Add other fields here as needed */}

      <StyledButton
        className="mt-4"
        // style={{
        //     backgroundColor: !(
        //         !userDetails.firstname ||
        //         !userDetails.lastname ||
        //         !userDetails.email ||
        //         !userDetails.role
        //     )
        //         ? "#4E70EA"
        //         : "grey",
        // }}
        onClick={() => handleEditUser(userDetails)}
        disabled={
          !userDetails.firstname ||
          !userDetails.lastname ||
          !userDetails.email ||
          !userDetails.role
        }
      >
        Save Changes
      </StyledButton>
    </Modal>
  );
};

export default EditUserInfoModal;
