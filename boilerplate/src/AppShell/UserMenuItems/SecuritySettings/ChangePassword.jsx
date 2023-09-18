import React, { useEffect } from 'react';
import { PasswordInput, Button, Stack, Title, Card, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from "@mantine/notifications";

const ChangePassword = ({ onPasswordChange, canSave }) => {
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validate: {
            confirmPassword: (value, values) => value !== values.newPassword ? 'Passwords do not match' : null
        }
    });

    const newPassword = form.values.newPassword;

    useEffect(() => {
        onPasswordChange(newPassword);
    }, [newPassword, onPasswordChange]);

    const handleSubmit = (values) => {
        console.log(values);

        if (canSave) {
            showNotification({
                type: 'success',
                title: `Password changed successfully!`,
                message: `Your password has been updated.`,
            });
        } else {
            showNotification({
                type: 'warning',
                title: `Password change failed!`,
                message: `Ensure all validations are met.`,
            });
        }
    };

    return (
        <Card shadow='md' p={30}>
            <Stack>
                <Title mb={10} size={'lg'}>Change Password</Title>
                <Divider />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack mt={30}>
                        <PasswordInput
                            label="Old Password"
                            {...form.getInputProps('oldPassword')}
                        />

                        <PasswordInput
                            label="Set New Password"
                            {...form.getInputProps('newPassword')}
                        />

                        <PasswordInput
                            label="Confirm Password"
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Button w={'100%'} type="submit" disabled={!canSave}>Save</Button>
                    </Stack>
                </form>
            </Stack>
        </Card>
    );
};

export default ChangePassword;