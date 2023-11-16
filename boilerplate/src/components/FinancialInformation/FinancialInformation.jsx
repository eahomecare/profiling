import React from 'react';
import { EditableTable } from '../EditableTable/EditableTable';

const title = 'Financial Information';



const initialData = [];

const headerData = ['Name', 'Acc. No', 'Variant', 'IFSC code', 'Branch'];

const createEmptyRow = () => ({
    id: '',
    name: '',
    acc_no: '',
    variant: '',
    ifsc: '',
    branch: '',
});


export function FinancialInformation() {
    return (
        <EditableTable
            title={title}
            initialData={initialData}
            headerData={headerData}
            createEmptyRow={createEmptyRow}
            rowData={createEmptyRow()}
        />
    );
}