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
import axios from "axios";
import { useSelector } from "react-redux";

const ChangePassword = ({ onPasswordChange, canSave }) => {
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Password does not match" : null,
    },
  });

  const { user } = useSelector((state) => state.auth);

  const newPassword = form.values.newPassword;

  useEffect(() => {
    onPasswordChange(newPassword);
  }, [newPassword, onPasswordChange]);

  const handleSubmit = async (values) => {
    try {
      if (canSave) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/change-password`,
          {
            email: user.email,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
        );

        if (response.status === 200) {
          showNotification({
            type: "success",
            title: `Password changed successfully!`,
            message: `Your password has been updated.`,
          });
        } else {
          // handle other status codes if required
          showNotification({
            type: "error",
            title: `Password change failed!`,
            message: response.data.message || "Unexpected error occurred",
          });
        }
      } else {
        showNotification({
          type: "warning",
          title: `Password change failed!`,
          message: `Ensure all validations are met.`,
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        title: `Password change failed!`,
        message: error.response?.data.message || "Unexpected error occurred",
      });
    }
  };

  return (
    <Card shadow="lg" p={30} radius={"md"}>
      <Stack>
        <Title mb={10} size={"lg"} c="#2B1DFD">
          Change Password
        </Title>
        <Divider c="#2B1DFD" />
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
