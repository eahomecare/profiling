import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    TextInput,
    ActionIcon,
    useMantineTheme,
    Center,
    Stack,
    Avatar,
} from '@mantine/core';
import { IconUser, IconX } from '@tabler/icons-react';
import assets from './assets';

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

    const handleSimulateCall = () => {
        if (isValidMobileNumber) {
            setShowIcon(true);
            setIframeSrc(`/agent?mobileNo=${mobileNumber}`)
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
                    <Avatar
                        style={{ cursor: 'pointer' }}
                        onClick={toggleIframe}
                        size={100}
                        radius={100}
                        src={assets.AddProfile}
                    />
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
                            width: '75%',
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