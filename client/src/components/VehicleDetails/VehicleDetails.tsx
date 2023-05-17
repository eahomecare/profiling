import { CustomSelectInput } from '../common/CustomSelectInput';
import { EditableTable } from '../common/EditableTable';

const title = 'Vehicle Details'

const statusData = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

interface TableSelectionProps {
    id: string;
    name: string;
    vin: string;
    productType: string;
    validity: string;
    expiryDate: string;
    status: string;
}

const initialData: TableSelectionProps[] = [
    {
        id: '1',
        name: 'Maruti Suzuki Swift Desire',
        vin: '1HGBH41JXMN109188',
        productType: 'RSA 1-year',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
    {
        id: '2',
        name: 'Maruti Suzuki Swift Desire',
        vin: '1HGBH41JXMN109188',
        productType: 'RSA 1-year',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
    {
        id: '3',
        name: 'Maruti Suzuki Swift Desire',
        vin: '1HGBH41JXMN109188',
        productType: 'RSA 1-year',
        validity: '1',
        expiryDate: '12-Dec-2023',
        status: 'active',
    },
];

const headerData = ['Name', 'VIN/Chassis No.', 'Product Type', 'Validity(in years)', 'Expiry Date', 'Status'];

const createEmptyRow = (): TableSelectionProps => ({
    id: '',
    name: '',
    vin: '',
    productType: '',
    validity: '',
    expiryDate: '',
    status: '',
});

export function VehicleDetails() {
    return <EditableTable<TableSelectionProps>
        title={title}
        initialData={initialData}
        headerData={headerData}
        createEmptyRow={createEmptyRow}
        customInputs={{ status: (value, onChange) => <CustomSelectInput value={value} onChange={onChange} data={statusData} /> }}
    />;
}