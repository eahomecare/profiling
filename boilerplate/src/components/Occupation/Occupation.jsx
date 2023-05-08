import { EditableTable } from '../EditableTable/EditableTable';

const title = 'Occupation'



const initialData = [
    {
        id: '1',
        type: 'Property Dealer',
        industry: 'Business',
        to: '2005',
        from: '2009',
        incomeBracket: '₹7,00,000 - ₹15,00,000',
    },
    {
        id: '2',
        type: 'Stock Exchange',
        industry: 'Finance',
        to: '2008',
        from: 'Present',
        incomeBracket: '₹15,00,000 - ₹30,00,000',
    },
];

const headerData = ['Type', 'Industry', 'To', 'From', 'Income Bracket'];

const createEmptyRow = () => ({
    id: '',
    type: '',
    industry: '',
    to: '',
    from: '',
    incomeBracket: '',
});

export function Occupation() {
    return <EditableTable title={title} initialData={initialData} headerData={headerData} createEmptyRow={createEmptyRow} />;
}