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
        variant: 'Savings',
        ifscCode: 'SBIN0000343',
        branch: 'Bandra',
    },
    {
        id: '2',
        name: 'Bank of Maharahstra',
        accNo: 'A/Cxxxxxxxxxxx',
        variant: 'Current',
        ifscCode: 'BOM0005943',
        branch: 'Andhari West',
    },
    {
        id: '3',
        name: 'Bank of Baroda',
        accNo: 'A/Cxxxxxxxxxxx',
        variant: 'Current',
        ifscCode: 'BOB0005943',
        branch: 'Navi Mumbai',
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