import { Flex, Group, ScrollArea, Stack, Text, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Questionnaire.css';

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
    level: number;
    category: string;
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

interface QuestionnaireProps {
    categories: Categories,
    setQuestionsHistory: (questions: SelectedQuestions[]) => void
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ categories, setQuestionsHistory }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestions[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);

        const fetchQuestions = async () => {
            const categoriesKeys = Object.keys(categories);
            const randomCategories = [];
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * categoriesKeys.length);
                const randomCategoryKey = categoriesKeys[randomIndex];
                const randomCategoryItems = categories[randomCategoryKey];
                randomCategories.push(randomCategoryItems);
                categoriesKeys.splice(randomIndex, 1);
            }

            const fetchedQuestions: SelectedQuestions[] = [];
            for (let categoryItems of randomCategories) {
                const bodyInputParts = [];
                for (let item of categoryItems) {
                    bodyInputParts.push(`key: ${item.key}, level: ${item.level}`);
                }

                const body = { "input": bodyInputParts.join(", ") };
                const response = await axios.post(`${process.env.REACT_APP_AI_URL}/process`, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = response.data.result;
                let questionText
                let questionLevel
                let questionAnswers
                try {
                    questionText = result.split(': ')[2].split(', level')[0];
                    questionLevel = parseInt(result.split(', level: ')[1].split(', Answers')[0]);
                    questionAnswers = result.split('Answers: ')[1].split(', ');
                }
                catch {
                    console.error('Failed to get a question ')
                    questionText = "Test Question"
                    questionLevel = 2
                    questionAnswers = ["Test Answer 1", "Test Answer 2", "Test Answer 3", "None"]
                }
                questionAnswers.push('None')

                fetchedQuestions.push({
                    id: fetchedQuestions.length + 1,
                    question: questionText,
                    answers: questionAnswers.map((text, idx) => ({ id: idx + 1, text })),
                    type: 'multiple',
                    level: questionLevel,
                    category: categoryItems[0].key, // assuming the first key is the main category
                });
            }

            setSelectedQuestions(fetchedQuestions);
            setQuestionsHistory(fetchedQuestions);
            setIsLoading(false);
        };

        fetchQuestions();
    }, [])

    useEffect(() => {
        const updatedQuestions = selectedQuestions.map(question => ({
            ...question,
            selectedAnswers: selectedAnswers[question.id] || []
        }));

        setQuestionsHistory(updatedQuestions);
    }, [selectedAnswers])

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader color='red' variant='bars' />
            </div>
        );
    }

    return (
        <div>
            <Stack spacing={'xs'} >
                <ScrollArea.Autosize mah={220} maw={400} mx="auto">
                    {selectedQuestions.map((question, index) => (
                        <div key={question.id}>
                            <Text pt={15} fz={'sm'} c='dimmed'>{`Q${index + 1}: ${question.question}`}</Text>
                            <Group spacing={1}>
                                {question.answers.map(answer => (
                                    <label key={answer.id}>
                                        <Group spacing={4}>
                                            <input
                                                type={'checkbox'}
                                                checked={selectedAnswers[question.id]?.includes(answer.id) || false}
                                                onChange={() => handleAnswerChange(question.id, answer.id, question.type === 'multiple')}
                                            />
                                            <Text fz={'sm'} mr={5} c='dimmed'>{answer.text}</Text>
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