// @ts-nocheck
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
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import axios, { AxiosError } from 'axios';

interface ProfileDetails {
    name: string;
    email: string;
    mobileNo: string;
    source: string;
    city: string;
    customerId: string;
}

interface Category {
    key: string;
    level: number;
}

interface Categories {
    sports: Category[];
    food: Category[];
    travel: Category[];
    music: Category[];
    fitness: Category[];
    automobile: Category[];
    gadget: Category[];
    technology: Category[];
}

interface AgentProfile {
    details: ProfileDetails;
    categories: Categories;
    profileCompletion: number;
    profilingTypes: string[];
}

const initialProfileDetails: ProfileDetails = {
    name: '',
    email: '',
    mobileNo: '',
    source: '',
    city: '',
    customerId: '',
};

const AgentEntry = () => {
    const { name, email, source, city, mobileNo, customerId, categories, profileCompletion, profilingTypes = "" } = useQueryParams();
    const [currentProfile, setCurrentProfile] = useState<ProfileDetails>({ name, email, mobileNo, source, city, customerId });
    const [percentageCompleted, setPercentageCompleted] = useState<number>(parseInt(profileCompletion, 10));
    const [profilingInterests, setProfilingInterests] = useState<string[]>(profilingTypes.split(','));
    const [categoryObject, setCategoryObject] = useState<Categories>(JSON.parse(categories));
    const [profileList, setProfileList] = useState<AgentProfile[]>([{ details: currentProfile, categories: categoryObject, profileCompletion: percentageCompleted, profilingTypes: profilingInterests }]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFullScreen, setFullScreen] = useState(false);
    const [questionHistory, setQuestionHistory] = useState<SelectedQuestions[]>([]);
    const [keywordsAdded, setKeywordsAdded] = useState<string[]>([]);

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

    useEffect(() => {
        console.log('questionHistory', questionHistory);
        console.log('categories in AgentEntry', categories)
    }, [questionHistory]);

    const handleProfileChange = (key: keyof ProfileDetails, value: string) => {
        setCurrentProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
    };

    const errorNotification = (error: AxiosError) => notifications.show({
        id: 'submit-error',
        withCloseButton: true,
        onClose: () => console.log('unmounted'),
        onOpen: () => console.log('mounted'),
        autoClose: 5000,
        title: error.message,
        message: 'There seems to be a problem with the network',
        color: 'red',
        icon: <IconX />,
        className: 'my-notification-class',
        loading: false,
    });

    const successNotification = () => {
        notifications.show({
            id: 'submit-success',
            withCloseButton: true,
            onClose: () => console.log('unmounted'),
            onOpen: () => console.log('mounted'),
            autoClose: 5000,
            title: 'Success',
            message: 'Profile has been submitted successfully',
            color: 'teal',
            icon: <IconCheck />,
            className: 'my-notification-class',
            loading: false,
        });
    };

    //Submit the keywords and questionHistory
    const handleProfileSubmit = async () => {
        try {
            if (keywordsAdded.length > 0) {

                // Making keywords API friendly and submitting one at a time
                const keywordsPayloadBody = {
                    customerId,
                    keywordsPayload: keywordsAdded
                }
                const response = await fetch(`${process.env.REACT_APP_API_URL}/keywords/update/many`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(keywordsPayloadBody),
                });
                if (!response.ok) {
                    console.error("Error updating keyword:", response.statusText);
                    return;
                }
                console.log("Keywords updated successfully!");
            }
        }
        catch (e) {
            console.log('Failed to submit keywords!')
        }
        finally {
            try {
                const url = `${process.env.REACT_APP_API_URL}/question/process`
                const body = {
                    customerId,
                    history: questionHistory
                }
                console.log('body =>', body)
                console.dir(body)
                // setting timeout for atlas
                await axios.post(url, body)
                    .then(console.log)
                    .then(successNotification)
                    .then(() => setProfileList(prevProfileList => [...prevProfileList, { details: currentProfile, categories: categoryObject, profileCompletion: 0, profilingTypes: [] }]))
                    .then(() => setTimeout(() => {
                        window.parent.postMessage('closeIframe', '*');
                    }, 2000))
                    .catch(errorNotification)
                    .catch(console.log)
            }
            catch {
                errorNotification(new AxiosError('Failed to submit questionHistory!'))
            }
        }
    };

    const handleClose = (submit: boolean) => {
        handleProfileSubmit();
    };

    const handleIconXClick = () => {
        handleProfileSubmit();
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
        <Paper p={10} >
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
                    <KeywordsEntry setKeywordsAdded={setKeywordsAdded} />
                    <Remarks />
                </Box>
                <Box>
                    <Questionnaire categories={categoryObject} setQuestionsHistory={setQuestionHistory} />
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