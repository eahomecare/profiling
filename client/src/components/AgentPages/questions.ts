interface Answer {
    id: number;
    text: string;
}

export interface Question {
    id: number;
    question: string;
    answers: Answer[];
    type: 'single' | 'multiple';
}

export const questions: Question[] = [
    {
        id: 1,
        question: 'What is your favourite cuisine?',
        answers: [
            { id: 1, text: 'Japanese' },
            { id: 2, text: 'Mexican' },
            { id: 3, text: 'Continental' },
            { id: 4, text: 'Indian' }
        ],
        type: 'multiple'
    },
    {
        id: 2,
        question: 'Are you fascinated about apple products?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 3,
        question: 'Which sport do you play often?',
        answers: [
            { id: 1, text: 'Regular' },
            { id: 2, text: 'Rarely' },
            { id: 3, text: 'Not interested' },
            { id: 4, text: 'Occasionally' }
        ],
        type: 'single'
    },
    {
        id: 4,
        question: 'What is your dream destination?',
        answers: [
            { id: 1, text: 'Switzerland' },
            { id: 2, text: 'African countries' },
            { id: 3, text: 'European countries' },
            { id: 4, text: 'USA' },
            { id: 5, text: 'Others' }
        ],
        type: 'multiple'
    },
    {
        id: 5,
        question: 'What do you prefer for your entertainment?',
        answers: [
            { id: 1, text: 'Meet and Great' },
            { id: 2, text: 'Travel' },
            { id: 3, text: 'Sports' },
            { id: 4, text: 'Food' },
            { id: 5, text: 'Travel' },
            { id: 6, text: 'Hangouts' }
        ],
        type: 'multiple'
    },
    {
        id: 6,
        question: 'What is your daily routine?',
        answers: [
            { id: 1, text: 'Gym' },
            { id: 2, text: 'Exercise' },
            { id: 3, text: 'Sports' },
            { id: 4, text: 'Others' }
        ],
        type: 'multiple'
    },
    {
        id: 7,
        question: 'Are you planning any trip?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 8,
        question: 'Any plans for your anniversary?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 9,
        question: 'How often do go to Gym?',
        answers: [
            { id: 1, text: 'Regular' },
            { id: 2, text: 'Rarely' },
            { id: 3, text: 'Not interested' },
            { id: 4, text: 'Occasionally' }
        ],
        type: 'single'
    },
    {
        id: 10,
        question: 'How do you spend on leisure time?',
        answers: [
            { id: 1, text: 'Sports' },
            { id: 2, text: 'Reading books' },
            { id: 3, text: 'Hangouts' },
            { id: 4, text: 'Travel' },
            { id: 5, text: 'Others' }
        ],
        type: 'multiple'
    },
    {
        id: 11,
        question: 'Do you have membership in any social clubs?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 12,
        question: 'Do you like scuba diving?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 13,
        question: 'Are you planning any vacation with your family?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 14,
        question: 'Do you love to spend on musical nights?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 15,
        question: 'How often do you play Cricket?',
        answers: [
            { id: 1, text: 'Regular' },
            { id: 2, text: 'Rarely' },
            { id: 3, text: 'Not interested' },
            { id: 4, text: 'Occasionally' }
        ],
        type: 'single'
    },
    {
        id: 16,
        question: 'Are you interested in watching IPL?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 17,
        question: 'Are you interested in watching Fifa World Cup?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
    {
        id: 18,
        question: 'Do you read or watch sports news Daily?',
        answers: [
            { id: 1, text: 'Yes' },
            { id: 2, text: 'No' }
        ],
        type: 'single'
    },
];