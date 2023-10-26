import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Title,
  TextInput,
  Avatar,
  Center,
  Text,
  ActionIcon,
  Group,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import StyledTextInput from "../../../StyledComponents/StyledTextInput";
import StyledDateInput from "../../../StyledComponents/StyledDateInput";
import StyledButton from "../../../StyledComponents/StyledButton";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const form = useForm({
    initialValues: {
      emailId: "",
      mobileNo: "",
      dateOfBirth: "",
      image: null,
    },
    validate: {
      emailId: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email";
      },
      mobileNo: (value) => {
        if (!/^[6789]/.test(value))
          return "Mobile number should start with 6, 7, 8, or 9";
        if (value.length !== 10) return "Mobile number should be 10 digits";
        if (parseInt(value, 10).toString() !== value)
          return "Mobile number should only contain numbers";
        return null;
      },
      dateOfBirth: (value) => {
        if (!value) return "Date of Birth is required";
        const enteredDate = new Date(value);
        const today = new Date();
        return enteredDate >= today
          ? "Date of Birth should be before today's date"
          : null;
      },
      image: (value) => {
        if (!value) return null;
        if (value.size > 5 * 1024 * 1024)
          return "File size should be less than 5MB";
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(value.type))
          return "Invalid file type. Only JPEG or PNG is allowed";
        return null;
      },
    },
    validateInputOnChange: true,
  });

  const imageInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.size > 5 * 1024 * 1024 ||
        !["image/jpeg", "image/png"].includes(file.type)
      ) {
        showNotification({
          type: "error",
          title: `Invalid Image`,
          message: `Please upload a valid JPEG or PNG image less than 5MB.`,
        });
      } else {
        form.setFieldValue("image", file);
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        showNotification({
          type: "success",
          title: `Image uploaded successfully!`,
          message: `Image is set for your profile. Please save`,
        });
      }
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setFieldValue("image", null);
    imageInputRef.current.value = null;
    showNotification({
      type: "info",
      title: `Image Removed`,
      message: `Profile image has been removed.`,
    });
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    showNotification({
      type: "default",
      title: `Profile saved successfully!`,
      message: `Your profile details have been updated.`,
    });
  };

  return (
    <Box>
      <Card shadow="lg" p={30} radius={"md"}>
        <Stack>
          <Title mb={10} size={"lg"} c="#2B1DFD">
            My Profile
          </Title>
          <Divider c="#2B1DFD" />
          <Center>
            <Stack>
              <Center>
                <Title size={30} c="#2B1DFD">
                  {user?.email?.split("@")[0]}
                </Title>
              </Center>
              {imagePreview && (
                <Avatar size={"xl"} src={imagePreview} radius="xl" />
              )}
              {imagePreview && (
                <Center>
                  <ActionIcon
                    onClick={handleDeleteImage}
                    sx={{
                      color: "#2B1DFD",
                      "&:hover": {
                        backgroundColor: "#F3F6FF",
                      },
                    }}
                  >
                    <IconX />
                  </ActionIcon>
                </Center>
              )}
            </Stack>
          </Center>
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
            <Button
              variant="outline"
              compact
              styles={{
                root: {
                  borderColor: "#2B1DFD",
                  color: "#2B1DFD",
                  "&:hover": {
                    backgroundColor: "#F3F6FF",
                    color: "#2B1DFD",
                  },
                },
              }}
              onClick={() => imageInputRef.current.click()}
            >
              <Text c={"dimmed"}>Upload Image</Text>
            </Button>
            <Stack mt={30}>
              <Group>
                <StyledTextInput
                  sx={{
                    flexGrow: 1,
                  }}
                  label="Email ID"
                  placeholder={user?.email}
                  {...form.getInputProps("emailId")}
                  disabled
                />
                <ActionIcon mt={15} c={"green"}>
                  <IconCheck />
                </ActionIcon>
              </Group>

              <Group>
                <StyledTextInput
                  sx={{
                    flexGrow: 1,
                  }}
                  label="Mobile No"
                  placeholder="9876543210"
                  {...form.getInputProps("mobileNo")}
                  inputMode="numeric"
                  disabled
                />
                <ActionIcon mt={15} c={"green"}>
                  <IconCheck />
                </ActionIcon>
              </Group>

              <StyledDateInput
                valueFormat="DD MMM, YYYY"
                maxDate={new Date()}
                label="Date of Birth"
                {...form.getInputProps("dateOfBirth")}
              />

              <input
                type="file"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
                accept=".jpeg, .jpg, .png"
              />
              <StyledButton type="submit">Save</StyledButton>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};

export default MyProfile;
