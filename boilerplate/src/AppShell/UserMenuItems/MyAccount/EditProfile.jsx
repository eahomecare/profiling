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
      <Card shadow="md" p={30} radius={"md"} bg={"#DDE5FF"}>
        <Stack>
          <Title mb={10} size={"lg"}>
            Edit Profile
          </Title>
          <Divider />
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Stack mt={30}>
              <TextInput
                label="Name"
                placeholder="Enter your name"
                {...form.getInputProps("name")}
              />

              <TextInput
                label="Address"
                placeholder="Enter your address"
                {...form.getInputProps("address")}
              />

              <Group>
                <TextInput
                  label="Pincode"
                  placeholder="Enter your pincode"
                  {...form.getInputProps("pincode")}
                  inputMode="numeric"
                />

                <Select
                  placeholder="Select your state"
                  label="State"
                  data={[]}
                  {...form.getInputProps("state")}
                />

                <Select
                  placeholder="Select your city"
                  label="City"
                  data={[]}
                  {...form.getInputProps("city")}
                />
              </Group>

              <Button bg={"#4E70EA"} w={"100%"} type="submit">
                Update Profile
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};

export default EditProfile;
