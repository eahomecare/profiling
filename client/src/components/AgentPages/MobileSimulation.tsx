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

interface SimulateCallProps { }

const initialProfileList = [
    {
        details: {
            name: 'Yuvraj Singh',
            email: 'yuvisingh8888@gmail.com',
            mobileNo: '9999999999',
            source: 'Homecare',
            city: 'Mumbai',
            customerId: 'flkjs'
        },
        categories: {
            sports: [{ key: 'sports', level: 1 }, { key: 'volleyball', level: 2 }],
            food: [{ key: 'food', level: 1 }, { key: 'Indian', level: 2 }],
            travel: [{ key: 'travel', level: 1 }],
            music: [{ key: 'music', level: 1 }],
            fitness: [{ key: 'fitness', level: 1 }],
            automobile: [{ key: 'automobile', level: 1 }],
            gadget: [{ key: 'gadget', level: 1 }],
            technology: [{ key: 'technology', level: 1 }],
        },
        profileCompletion: 55,
        profilingTypes: ['Avid Traveler', 'Foodie']
    },
    {
        details: {
            name: 'Elon Musk',
            email: 'elonmusk@tesla.com',
            mobileNo: '8888888888',
            source: 'Homecare,Cyberior',
            city: 'Bangalore',
            customerId: 'flewkjs'
        },
        categories: {
            sports: [{ key: 'sports', level: 1 }, { key: 'volleyball', level: 2 }],
            food: [{ key: 'food', level: 1 }],
            travel: [{ key: 'travel', level: 1 }],
            music: [{ key: 'music', level: 1 }],
            fitness: [{ key: 'fitness', level: 1 }],
            automobile: [{ key: 'automobile', level: 1 }],
            gadget: [{ key: 'gadget', level: 1 }],
            technology: [{ key: 'technology', level: 1 }],
        },
        profileCompletion: 75,
        profilingTypes: ['Techie', 'Sports Fan']
    },
];

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
            setShowIcon(true);
            const profile = initialProfileList.find(
                (profile) => profile.details.mobileNo === mobileNumber
            );
            if (profile) {
                try {
                    const response = await axios.get('https://your-api-url', {
                        params: {
                            mobileNo: profile.details.mobileNo,
                            customerId: profile.details.customerId,
                        },
                    });
                    if (response.data) {
                        profile.profileCompletion = response.data.profileCompletion;
                        profile.categories = response.data.categories;
                    }
                } catch (error) {
                    console.error('Failed to fetch updated profile details:', error);
                }
                console.log('categories in Mobilesimulation before iframe', JSON.stringify(profile.categories))
                setIframeSrc(
                    `/agent?${new URLSearchParams({
                        ...profile.details,
                        profileCompletion: profile.profileCompletion.toString(),
                        categories: JSON.stringify(profile.categories),
                        profilingTypes: profile.profilingTypes.join(","),
                    })}`
                );
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
        setIsValidMobileNumber(isValid);
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