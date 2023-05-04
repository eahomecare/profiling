import { EditableTable } from '../common/EditableTable';

const title = 'Bank Details'

interface TableSelectionProps {
    id: string;
    name: string;
    accNo: string;
    variant: string;
    ifscCode: string;
    branch: string;
}

const initialData: TableSelectionProps[] = [
    {
        id: '1',
        name: 'SBI',
        accNo: 'A/Cxxxxxxxxxxx',
        variant: 'savings',
        ifscCode: 'SBIN0000343',
        branch: 'Bandra',
    },
    {
        id: '2',
        name: 'SBI',
        accNo: 'A/Cxxxxxxxxxxx',
        variant: 'savings',
        ifscCode: 'SBIN0000343',
        branch: 'Bandra',
    },
    {
        id: '3',
        name: 'SBI',
        accNo: 'A/Cxxxxxxxxxxx',
        variant: 'savings',
        ifscCode: 'SBIN0000343',
        branch: 'Bandra',
    },
];

const headerData = ['Name', 'Acc No.', 'Variant', 'IFSC Code', 'Branch'];

const createEmptyRow = (): TableSelectionProps => ({
    id: '',
    name: '',
    accNo: '',
    variant: '',
    ifscCode: '',
    branch: '',
});

export function BankDetails() {
    return <EditableTable<TableSelectionProps> title={title} initialData={initialData} headerData={headerData} createEmptyRow={createEmptyRow} />;
}