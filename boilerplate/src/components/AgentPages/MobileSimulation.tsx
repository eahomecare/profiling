// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    TextInput,
    ActionIcon,
    useMantineTheme,
    Center,
    Stack,
} from '@mantine/core';
import { IconUser, IconX } from '@tabler/icons-react';
import BouncingAvatar from './BouncingAvatar';
import axios from 'axios';
import mobileIdMap from './mobileIdMap'

interface SimulateCallProps { }

const SimulateCall: React.FC<SimulateCallProps> = () => {
    const theme = useMantineTheme();
    const [showIcon, setShowIcon] = useState(false);
    const [showIframe, setShowIframe] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [mobileNumber, setMobileNumber] = useState('');
    const [isValidMobileNumber, setIsValidMobileNumber] = useState(false);
    const [mobileNumberError, setMobileNumberError] = useState('');
    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'closeIframe') {
                setShowIframe(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleSimulateCall = async () => {
        if (isValidMobileNumber) {
            const customerId = mobileIdMap[mobileNumber];
            if (customerId) {
                try {
                    const responseProfile = await axios.get(`${process.env.REACT_APP_API_URL}/customers/${customerId}`);
                    const responseCategories = await axios.get(`${process.env.REACT_APP_API_URL}/profile_mapping/${customerId}`);
                    const responseCompletion = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${customerId}`);
                    console.log('profile response', responseProfile)
                    const details = {
                        name: responseProfile.data.customer_details.personal_details.full_name || '-',
                        email: responseProfile.data.customer_details.email || '-',
                        mobileNo: responseProfile.data.customer_details.mobile || '-',
                        source: responseProfile.data.customer_details.source || '-',
                        city: responseProfile.data.customer_details.personal_details.location || '-',
                        customerId: customerId
                    }

                    console.log('details', details)
                    console.log('response Categories data', responseCategories)

                    if (responseProfile.data && responseCategories.data && responseCompletion.data) {
                        setIframeSrc(
                            `/agent?${new URLSearchParams({
                                ...details,
                                profileCompletion: responseCompletion.data.completionPercentage.toString(),
                                categories: JSON.stringify(responseCategories.data.categories),
                                profilingTypes: 'Foodie',
                            })}`
                        );
                    } else {
                        throw new Error("Failed to get updated profile details");
                    }

                    setShowIcon(true);
                } catch (error) {
                    console.error('Failed to fetch updated profile details:', error);
                }
            }
        } else {
            setShowIcon(false);
        }
    };

    const handleEndCall = () => {
        setShowIcon(false);
    };

    const validateMobileNumber = (value: string) => {
        const isValid = /^([6-9]{1}\d{9})$/.test(value);
        setIsValidMobileNumber(true);
        setMobileNumberError(isValid ? '' : 'Please enter a valid mobile number');
    };

    const handleMobileNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setMobileNumber(value);
        validateMobileNumber(value);
    };

    const toggleIframe = () => {
        setShowIframe((prevState) => !prevState);
    };

    return (
        <div>
            <Center>
                <Stack>
                    <TextInput
                        label="Mobile Number"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                        required
                        error={mobileNumberError}
                    />
                    <Button onClick={handleSimulateCall} disabled={!isValidMobileNumber}>
                        Simulate Call
                    </Button>
                    <Button onClick={handleEndCall}>End Call</Button>
                </Stack>
            </Center>
            {showIcon && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: theme.spacing.xs,
                        right: theme.spacing.xs,
                        zIndex: 1000,
                    }}
                >
                    <BouncingAvatar shouldBounce={showIcon} onClick={toggleIframe} />
                </div>
            )}

            {showIframe && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 999,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            zIndex: 1001,
                        }}
                    >
                        <ActionIcon onClick={toggleIframe} size="xl" c="white">
                            <IconX size={24} />
                        </ActionIcon>
                    </div>
                    <iframe
                        ref={iframeRef}
                        src={iframeSrc}
                        title="Sample iFrame"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '60%',
                            height: '75%',
                            transform: 'translate(-50%, -50%)',
                            border: 'none',
                            borderRadius: theme.radius.md,
                        }}
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
};

export default SimulateCall;