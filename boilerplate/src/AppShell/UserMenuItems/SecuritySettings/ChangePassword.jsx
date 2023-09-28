import React, { useEffect } from "react";
import {
  PasswordInput,
  Button,
  Stack,
  Title,
  Card,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import StyledPasswordInput from "../../../StyledComponents/StyledPasswordInput";
import StyledButton from "../../../StyledComponents/StyledButton";

const ChangePassword = ({ onPasswordChange, canSave }) => {
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const newPassword = form.values.newPassword;

  useEffect(() => {
    onPasswordChange(newPassword);
  }, [newPassword, onPasswordChange]);

  const handleSubmit = (values) => {
    console.log(values);

    if (canSave) {
      showNotification({
        type: "success",
        title: `Password changed successfully!`,
        message: `Your password has been updated.`,
      });
    } else {
      showNotification({
        type: "warning",
        title: `Password change failed!`,
        message: `Ensure all validations are met.`,
      });
    }
  };

  return (
    <Card shadow="lg" p={30} radius={"md"}>
      <Stack>
        <Title mb={10} size={"lg"} c="#5C00F2">
          Change Password
        </Title>
        <Divider c="#5C00F2" />
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack mt={30}>
            <StyledPasswordInput
              label="Old Password"
              {...form.getInputProps("oldPassword")}
            />

            <StyledPasswordInput
              label="Set New Password"
              {...form.getInputProps("newPassword")}
            />

            <StyledPasswordInput
              label="Confirm Password"
              {...form.getInputProps("confirmPassword")}
            />

            <StyledButton type="submit" disabled={!canSave}>
              Save
            </StyledButton>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
};

export default ChangePassword;
