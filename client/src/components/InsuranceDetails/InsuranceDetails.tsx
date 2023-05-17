import { EditableTable } from '../common/EditableTable';
import { CustomSelectInput } from '../common/CustomSelectInput';

const title = 'Insurance Details'

const statusData = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

interface TableSelectionProps {
    id: string;
    source: string;
    productType: string;
    validity: string;
    expiryDate: string;
    status: string;
}

const initialData: TableSelectionProps[] = [
    {
        id: '1',
        source: 'HomeCare',
        productType: 'Home',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
    {
        id: '2',
        source: 'HomeCare',
        productType: 'Home',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
    {
        id: '3',
        source: 'HomeCare',
        productType: 'Home',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
];

const headerData = ['Source', 'Product Type', 'Validity(in years)', 'Expiry Date', 'status'];

const createEmptyRow = (): TableSelectionProps => ({
    id: '',
    source: '',
    productType: '',
    validity: '',
    expiryDate: '',
    status: '',
});

export function InsuranceDetails() {
    return <EditableTable<TableSelectionProps>
        title={title}
        initialData={initialData}
        headerData={headerData}
        createEmptyRow={createEmptyRow}
        customInputs={{ status: (value, onChange) => <CustomSelectInput value={value} onChange={onChange} data={statusData} /> }}
    />;
}