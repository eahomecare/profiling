import { Group, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';

interface Answer {
    id: number;
    text: string;
}

interface Question {
    id: number;
    question: string;
    answers: Answer[];
    type: 'single' | 'multiple';
}

interface SelectedAnswers {
    [questionId: number]: number[];
}

const questions: Question[] = [
    {
        id: 1,
        question: 'Do you prefer watching Soccer/Football over Cricket?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 2,
        question: 'What kind of Cuisine you prefer?',
        answers: [
            { id: 1, text: 'Indian' },
            { id: 2, text: 'Continental' },
            { id: 3, text: 'Japanese' },
            { id: 4, text: 'American' }
        ],
        type: 'multiple'
    },
    {
        id: 3,
        question: 'Which is your dream destination for Vacation?',
        answers: [
            { id: 1, text: 'Paris' },
            { id: 2, text: 'Switzerland' },
            { id: 3, text: 'Maldives' }
        ],
        type: 'single'
    },
];

const Questionnaire = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

    const handleAnswerChange = (questionId: number, answerId: number, isMultiple: boolean) => {
        setSelectedAnswers(prevState => {
            if (isMultiple) {
                if (!prevState[questionId]) {
                    return { ...prevState, [questionId]: [answerId] };
                } else if (prevState[questionId].includes(answerId)) {
                    return { ...prevState, [questionId]: prevState[questionId].filter(id => id !== answerId) };
                } else {
                    return { ...prevState, [questionId]: [...prevState[questionId], answerId] };
                }
            } else {
                return { ...prevState, [questionId]: [answerId] };
            }
        });
    };

    return (
        <div>
            <Stack spacing={'md'} >
                <ScrollArea.Autosize mah={220} maw={400} mx="auto">
                    {questions.map((question, index) => (
                        <div key={question.id}>
                            <Text mt={20} fz={'sm'} c='dimmed'>{`Q${index + 1}: ${question.question}`}</Text>
                            <Group>
                                {question.answers.map(answer => (
                                    <label key={answer.id}>
                                        <Group >
                                            <input
                                                type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                                                checked={selectedAnswers[question.id]?.includes(answer.id) || false}
                                                onChange={() => handleAnswerChange(question.id, answer.id, question.type === 'multiple')}
                                            />
                                            <Text fz={'sm'} c='dimmed'>{answer.text}</Text>
                                        </Group>
                                    </label>
                                ))}
                            </Group>
                        </div>
                    ))}
                </ScrollArea.Autosize>
            </Stack>
        </div>
    );
};

export default Questionnaire;