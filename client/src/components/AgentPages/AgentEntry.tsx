import { useEffect, useState } from 'react';
import { ActionIcon, Button, Flex, Paper, Modal, Text, Box, Group, Center, Divider } from '@mantine/core';
import { IconMaximize, IconX } from '@tabler/icons-react';
import { useQueryParams } from '../common/useQueryParams';
import ProfileCard from './ProfileCard';
import PercentageCompleted from './PercentageCompleted';
import ProfilingInterests from './ProfilingInterests';
import KeywordsEntry from './KeywordsEntry';
import Remarks from './Remarks';
import Questionnaire from './Questionnaire';

interface ProfileDetails {
    name: string;
    email: string;
    mobileNo: string;
    source: string;
    city: string;
}

interface AgentProfile {
    details: ProfileDetails;
    profileCompletion: number;
    profilingTypes: string[];
}

const initialProfileDetails: ProfileDetails = {
    name: '',
    email: '',
    mobileNo: '',
    source: '',
    city: '',
};

const initialProfileList: AgentProfile[] = [
    {
        details: {
            name: 'Yuvraj Singh',
            email: 'yuvisingh8888@gmail.com',
            mobileNo: '9999999999',
            source: 'Homecare',
            city: 'Mumbai',
        },
        profileCompletion: 75,
        profilingTypes: ['Avid Traveler', 'Foodie']
    },
    {
        details: {
            name: 'Elon Musk',
            email: 'elonmusk@tesla.com',
            mobileNo: '8888888888',
            source: 'Homecare,Cyberior',
            city: 'Bangalore',
        },
        profileCompletion: 75,
        profilingTypes: ['Techie', 'Sports Fan']
    },
];

const AgentEntry = () => {
    const { mobileNo } = useQueryParams();
    const [currentProfile, setCurrentProfile] = useState<ProfileDetails>({ ...initialProfileDetails, mobileNo });
    const [profileList, setProfileList] = useState<AgentProfile[]>(initialProfileList);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFullScreen, setFullScreen] = useState(false);
    const [percentageCompleted, setPercentageCompleted] = useState(0);
    const [profilingInterests, setProfilingInterests] = useState<string[]>([]);

    useEffect(() => {
        const profile = profileList.find(profile => profile.details.mobileNo === mobileNo);
        if (profile) {
            setCurrentProfile(profile.details);
            setPercentageCompleted(profile.profileCompletion)
            setProfilingInterests(profile.profilingTypes)
        } else {
            setCurrentProfile({ ...initialProfileDetails, mobileNo });
            setPercentageCompleted(0)
        }
    }, [mobileNo, profileList]);

    const handleProfileChange = (key: keyof ProfileDetails, value: string) => {
        setCurrentProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
    };

    const handleProfileSubmit = () => {
        setProfileList(prevProfileList => [...prevProfileList, { details: currentProfile, profileCompletion: 0, profilingTypes: [] }]);
        window.parent.postMessage('closeIframe', '*');
    };

    const handleClose = (submit: boolean) => {
        if (submit) {
            handleProfileSubmit();
        }
        setModalOpen(false);
        window.parent.postMessage('closeIframe', '*');
    };

    const handleIconXClick = () => {
        // setModalOpen(true);
        window.parent.postMessage('closeIframe', '*');
    };

    const toggleFullscreen = () => {
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
            setFullScreen(true);
        } else {
            document.exitFullscreen();
            setFullScreen(false);
        }
    };

    const profileExists = profileList.some(profile => profile.details.mobileNo === mobileNo);

    return (
        <Paper p={10}>
            <Box >
                <Group position='apart'>
                    <Box></Box>
                    <Center>
                        <Text fw={550}>Customer</Text>
                    </Center>
                    <Flex justify="flex-end" direction="column" style={{ marginBottom: '10px' }}>
                        <ActionIcon onClick={handleProfileSubmit}>
                            <IconX size={15} />
                        </ActionIcon>
                        <ActionIcon onClick={toggleFullscreen}>
                            <IconMaximize size={15} />
                        </ActionIcon>
                    </Flex>
                </Group>
                <Divider size={'xs'} />
            </Box>

            <Modal
                opened={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Confirm action"
                size="xs"
                transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}
            >
                <Text>Do you want to submit the changes?</Text>
                <Button onClick={() => handleClose(true)}>Submit</Button>
                <Button onClick={() => handleClose(false)}>Discard</Button>
            </Modal>

            <Paper pl={10} pr={10} radius={'md'} mt={5} bg={'#f1f3f5'}>
                <Group position='apart' grow>
                    <ProfileCard
                        details={currentProfile}
                        onDetailChange={handleProfileChange}
                        editable={!profileExists}
                    />
                    <Center>
                        <PercentageCompleted percentage={percentageCompleted} />
                    </Center>
                    <ProfilingInterests profilingInterests={profilingInterests} />
                </Group>
            </Paper>

            <Group position='apart' grow>
                <Box pt={10}>
                    <KeywordsEntry />
                    <Remarks />
                </Box>
                <Box>
                    <Questionnaire />
                </Box>
            </Group>

            <Divider my="md" size={'xs'} />
            <Flex justify={'flex-end'}>
                <Button bg={'#EF3E42'} onClick={handleProfileSubmit}>Submit</Button>
            </Flex>
        </Paper>
    );
};

export default AgentEntry;