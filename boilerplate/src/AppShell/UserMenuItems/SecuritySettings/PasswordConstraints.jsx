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
      /[^A-Za-z0-9\s]/.test(password),
    ];

    onValidationChange(validations.every((v) => v));
  }, [password, onValidationChange]);

  return (
    <Card shadow="lg" p={30} radius={"md"}>
      <Stack>
        <Title mb={10} size={"lg"} c="#0d5ff9">
          Password Constraints
        </Title>
        <Divider c="#0d5ff9" />
        <Group>
          <Checkbox
            styles={{
              input: {
                border: "1px solid #0d5ff9",
              },
            }}
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
            styles={{
              input: {
                border: "1px solid #0d5ff9",
              },
            }}
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
            styles={{
              input: {
                border: "1px solid #0d5ff9",
              },
            }}
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
            styles={{
              input: {
                border: "1px solid #0d5ff9",
              },
            }}
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
            styles={{
              input: {
                border: "1px solid #0d5ff9",
              },
            }}
            color={isValid(/[^A-Za-z0-9\s]/.test(password))}
            checked={/[^A-Za-z0-9\s]/.test(password)}
            label={
              <Text c={isValid(/[^A-Za-z0-9\s]/.test(password))}>
                At least 1 Symbols or special characters (excluding space)
              </Text>
            }
          />
        </Group>
      </Stack>
    </Card>
  );
};

export default PasswordConstraints;
