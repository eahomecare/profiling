import React, { useState, useRef } from 'react';
import {
    Box, Button, Card, Divider, Stack, Title, TextInput, Avatar, Center, Text, ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from "@mantine/notifications";
import { IconX } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';

const MyProfile = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const form = useForm({
        initialValues: {
            emailId: '',
            mobileNo: '',
            dateOfBirth: '',
            image: null
        },
        validate: {
            emailId: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : 'Invalid email';
            },
            mobileNo: (value) => {
                if (!/^[6789]/.test(value)) return 'Mobile number should start with 6, 7, 8, or 9';
                if (value.length !== 10) return 'Mobile number should be 10 digits';
                if (parseInt(value, 10).toString() !== value) return 'Mobile number should only contain numbers';
                return null;
            },
            dateOfBirth: (value) => {
                if (!value) return 'Date of Birth is required';
                const enteredDate = new Date(value);
                const today = new Date();
                return enteredDate >= today ? 'Date of Birth should be before today\'s date' : null;
            },
            image: (value) => {
                if (!value) return null;
                if (value.size > 5 * 1024 * 1024) return 'File size should be less than 5MB';
                const validTypes = ['image/jpeg', 'image/png'];
                if (!validTypes.includes(value.type)) return 'Invalid file type. Only JPEG or PNG is allowed';
                return null;
            }
        },
        validateInputOnChange: true
    });

    const imageInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(file.type)) {
                showNotification({
                    type: 'error',
                    title: `Invalid Image`,
                    message: `Please upload a valid JPEG or PNG image less than 5MB.`,
                });
            } else {
                form.setFieldValue('image', file);
                const url = URL.createObjectURL(file);
                setImagePreview(url);
                showNotification({
                    type: 'success',
                    title: `Image uploaded successfully!`,
                    message: `Image is set for your profile. Please save`,
                });
            }
        }
    };

    const handleDeleteImage = () => {
        setImagePreview(null);
        form.setFieldValue('image', null);
        imageInputRef.current.value = null;
        showNotification({
            type: 'info',
            title: `Image Removed`,
            message: `Profile image has been removed.`,
        });
    };

    const handleFormSubmit = (values) => {
        console.log(values);
        showNotification({
            type: 'default',
            title: `Profile saved successfully!`,
            message: `Your profile details have been updated.`,
        });
    };

    return (
        <Box>
            <Card shadow='md' p={30}>
                <Stack>
                    <Title mb={10} size={'lg'}>My Profile</Title>
                    <Divider />
                    <Center>
                        <Stack>
                            <Center>
                                <Title size={30}>Name</Title>
                            </Center>
                            {imagePreview &&
                                <Avatar
                                    size={'xl'}
                                    src={imagePreview}
                                    radius="xl"
                                />
                            }
                            {imagePreview &&
                                <Center>
                                    <ActionIcon
                                        onClick={handleDeleteImage}
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Center>
                            }
                        </Stack>
                    </Center>
                    <form onSubmit={form.onSubmit(handleFormSubmit)}>
                        <Button
                            variant='outline'
                            compact
                            c={'black'}
                            styles={{ root: { 'borderColor': 'black' } }}
                            onClick={() => imageInputRef.current.click()}>
                            <Text c={'dimmed'}>
                                Upload Image
                            </Text>
                        </Button>
                        <Stack mt={30}>
                            <TextInput
                                label="Email ID"
                                placeholder="your@email.com"
                                {...form.getInputProps('emailId')}
                            />

                            <TextInput
                                label="Mobile No"
                                placeholder="9876543210"
                                {...form.getInputProps('mobileNo')}
                                inputMode='numeric'
                            />

                            <DateInput
                                valueFormat="DD MMM, YYYY"
                                maxDate={new Date()}
                                label="Date of Birth"
                                {...form.getInputProps('dateOfBirth')}
                            />

                            <input
                                type="file"
                                ref={imageInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept=".jpeg, .jpg, .png"
                            />
                            <Button bg={'#4E70EA'} w={'100%'} type="submit">Save</Button>
                        </Stack>
                    </form>
                </Stack>
            </Card>
        </Box>
    );
};

export default MyProfile;