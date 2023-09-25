import React, { useEffect } from "react";
import {
  Checkbox,
  Title,
  Card,
  Stack,
  Divider,
  Group,
  Text,
} from "@mantine/core";

const PasswordConstraints = ({ password = "", onValidationChange }) => {
  const isValid = (condition) => (condition ? "green" : "red");

  useEffect(() => {
    const validations = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    onValidationChange(validations.every((v) => v));
  }, [password, onValidationChange]);

  return (
    <Card shadow="md" p={30} radius={"md"} bg={"#DDE5FF"}>
      <Stack>
        <Title mb={10} size={"lg"}>
          Password Constraints
        </Title>
        <Divider />
        <Group>
          <Checkbox
            color={isValid(password.length >= 8)}
            checked={password.length >= 8}
            label={
              <Text c={isValid(password.length >= 8)}>
                Your password must be at least 8 characters in length
              </Text>
            }
          />
        </Group>
        <Group>
          <Checkbox
            color={isValid(/[A-Z]/.test(password))}
            checked={/[A-Z]/.test(password)}
            label={
              <Text c={isValid(/[A-Z]/.test(password))}>
                At least 1 Uppercase letters [A-Z]
              </Text>
            }
          />
        </Group>
        <Group>
          <Checkbox
            color={isValid(/[a-z]/.test(password))}
            checked={/[a-z]/.test(password)}
            label={
              <Text c={isValid(/[a-z]/.test(password))}>
                At least 1 Lowercase letters (a-z)
              </Text>
            }
          />
        </Group>
        <Group>
          <Checkbox
            color={isValid(/[0-9]/.test(password))}
            checked={/[0-9]/.test(password)}
            label={
              <Text c={isValid(/[0-9]/.test(password))}>
                At least 1 Number (0-9)
              </Text>
            }
          />
        </Group>
        <Group>
          <Checkbox
            color={isValid(/[^A-Za-z0-9]/.test(password))}
            checked={/[^A-Za-z0-9]/.test(password)}
            label={
              <Text c={isValid(/[^A-Za-z0-9]/.test(password))}>
                At least 1 Symbols or special characters
              </Text>
            }
          />
        </Group>
      </Stack>
    </Card>
  );
};

export default PasswordConstraints;
