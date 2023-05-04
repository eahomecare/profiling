import { EditableTable } from '../common/EditableTable';

const title = 'Family Details'

interface TableSelectionProps {
    id: string;
    name: string;
    gender: string;
    relationship: string;
    phone: string;
    email: string;
}

const initialData: TableSelectionProps[] = [
    {
        id: '1',
        name: 'Sushma Sharma',
        gender: 'Female',
        relationship: 'Spouse',
        phone: '+91 834273824',
        email: 'sushmasharma123@email.com',
    },
    {
        id: '2',
        name: 'Sushma Sharma',
        gender: 'Female',
        relationship: 'Spouse',
        phone: '+91 834273824',
        email: 'sushmasharma123@email.com',
    },
    {
        id: '3',
        name: 'Sushma Sharma',
        gender: 'Female',
        relationship: 'Spouse',
        phone: '+91 834273824',
        email: 'sushmasharma123@email.com',
    },
];

const headerData = ['Name', 'Gender', 'Relationship', 'Phone No.', 'Email Address'];

const createEmptyRow = (): TableSelectionProps => ({
    id: '',
    name: '',
    gender: '',
    relationship: '',
    phone: '',
    email: '',

});

export function FamilyDetails() {
    return <EditableTable<TableSelectionProps> title={title} initialData={initialData} headerData={headerData} createEmptyRow={createEmptyRow} />;
}