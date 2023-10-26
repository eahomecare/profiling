import React from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Title,
  TextInput,
  Select,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import StyledTextInput from "../../../StyledComponents/StyledTextInput";
import StyledSelect from "../../../StyledComponents/StyledSelect";
import StyledButton from "../../../StyledComponents/StyledButton";

const EditProfile = () => {
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      pincode: "",
      state: "",
      city: "",
    },
  });

  const handleFormSubmit = (values) => {
    console.log(values);
    showNotification({
      type: "default",
      title: `Profile updated successfully!`,
      message: `Your profile details have been updated.`,
    });
  };

  return (
    <Box>
      <Card shadow="lg" p={30} radius={"md"}>
        <Stack>
          <Title mb={10} size={"lg"} c="#2B1DFD">
            Edit Profile
          </Title>
          <Divider c="#2B1DFD" />
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Stack mt={30}>
              <StyledTextInput
                label="Name"
                placeholder="Enter your name"
                {...form.getInputProps("name")}
              />

              <Group grow>
                <StyledTextInput
                  label="Pincode"
                  placeholder="Enter your pincode"
                  {...form.getInputProps("pincode")}
                  inputMode="numeric"
                />
                <StyledSelect
                  placeholder="Select your state"
                  label="State"
                  data={[]}
                  {...form.getInputProps("state")}
                />

                <StyledSelect
                  placeholder="Select your city"
                  label="City"
                  data={[]}
                  {...form.getInputProps("city")}
                />
              </Group>
              <StyledTextInput
                w={"100%"}
                label="Address"
                placeholder="Enter your address"
                {...form.getInputProps("address")}
              />

              <StyledButton type="submit">Update Profile</StyledButton>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};

export default EditProfile;
