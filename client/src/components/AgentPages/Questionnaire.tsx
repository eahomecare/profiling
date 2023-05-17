import { Flex, Group, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { questions } from './questions';
import './Questionnaire.css'

interface SelectedAnswers {
    [questionId: number]: number[];
}

interface Answer {
    id: number;
    text: string;
}

interface SelectedQuestions {
    id: number;
    question: string;
    answers: Answer[];
    type: 'single' | 'multiple';
}

const Questionnaire = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestions[]>([]);

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

    useEffect(() => {
        setSelectedQuestions(questions.sort(() => 0.5 - Math.random()).slice(0, 3));
    }, [])

    return (
        <div>
            <Stack spacing={'xs'} >
                <ScrollArea.Autosize mah={220} maw={400} mx="auto">
                    {selectedQuestions.map((question, index) => (
                        <div key={question.id}>
                            <Text pt={15} fz={'sm'} c='dimmed'>{`Q${index + 1}: ${question.question}`}</Text>
                            <Group spacing={7}>
                                {question.answers.map(answer => (
                                    <label key={answer.id}>
                                        <Group spacing={2} >
                                            <input
                                                type={'checkbox'}
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