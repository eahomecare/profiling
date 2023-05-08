import { useState } from 'react';
import BMISpeedometer from './BMImeter';
import { Box, Flex, Grid, Text, Button, TextInput, ActionIcon } from '@mantine/core';
import InfoTag from '../common/InfoTag';
import Allergies from './Allergies';
import { IconCheck, IconEdit, IconX } from '@tabler/icons-react';

const Health = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        firstName: 'Elon',
        lastName: 'Musk',
        dob: '1971-06-28',
        gender: 'Male',
        height: 170, // cm
        weight: 78, // kg
        bloodGroup: 'B+',
    });

    const titles = [
        'First Name',
        'Last Name',
        'Date of birth',
        'Gender',
        'Height',
        'Weight',
        'BMI',
        'Blood Group',
    ];

    const calculateBMI = (height: number, weight: number) => {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const bmiCategory = bmi < 18.5
            ? 'Underweight'
            : bmi >= 18.5 && bmi < 24.9
                ? 'Normal'
                : bmi >= 25 && bmi < 29.9
                    ? 'Overweight'
                    : 'Obesity';
        return `${bmi.toFixed(1)} (${bmiCategory})`;
    };

    const [tempData, setTempData] = useState({ ...data });

    const handleChange = (field: keyof typeof tempData, value: string | number) => {
        setTempData((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleSave = () => {
        setData(tempData);
        setIsEditing(false);
    };

    const handleDiscard = () => {
        setTempData(data);
        setIsEditing(false);
    };

    const renderSubjects = () => {
        const subjects = [
            tempData.firstName,
            tempData.lastName,
            tempData.dob,
            tempData.gender,
            isEditing ? tempData.height : `${tempData.height} cm [${Math.floor(tempData.height / 30.48)}" ${Math.floor(tempData.height % 30.48 / 2.54)}']`,
            isEditing ? tempData.weight : `${tempData.weight} kgs`,
            calculateBMI(tempData.height, tempData.weight),
            tempData.bloodGroup,
        ];
        const fields: Array<keyof typeof tempData> = [
            'firstName',
            'lastName',
            'dob',
            'gender',
            'height',
            'weight',
            'bloodGroup',
        ];

        return subjects.map((subject, index) => (
            <Grid.Col key={index} span={6}>
                {isEditing && index !== 6 ? (
                    <TextInput
                        label={titles[index]}
                        value={subject}
                        onChange={(event) =>
                            handleChange(fields[index], event.currentTarget.value)
                        }
                    />
                ) : (
                    <InfoTag title={titles[index]} subject={subject} />
                )}
            </Grid.Col>
        ));
    };


    return (
        <>
            <Box p={10}>
                <Text>Health Details</Text>
                <Flex justify="flex-end">
                    {!isEditing && (
                        <ActionIcon onClick={() => setIsEditing(true)} color="blue" variant="subtle" size={'sm'}>
                            <IconEdit color="#4E70EA" />
                        </ActionIcon>
                    )}
                    {isEditing && (
                        <>
                            <ActionIcon onClick={handleSave} color="green" variant="subtle" size={'sm'}>
                                <IconCheck color="#4E70EA" />
                            </ActionIcon>
                            <ActionIcon onClick={handleDiscard} color="red" variant="subtle" size={'sm'}>
                                <IconX color="#F34336" />
                            </ActionIcon>
                        </>
                    )}
                </Flex>
                <Flex>
                    <Grid gutter="xl" pt={'sm'}>
                        {renderSubjects()}
                    </Grid>
                    <BMISpeedometer bmi={parseFloat(calculateBMI(data.height, data.weight).split(' ')[0])} />
                </Flex>
                <Box mt={10}>
                    <Allergies />
                </Box>
            </Box>
        </>
    );
};

export default Health;