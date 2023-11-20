import React from 'react';
import { EditableTable } from '../EditableTable/EditableTable';

const title = 'Insurance Details';



const initialData = [];

const headerData = ['Source', 'Product Type', 'Validity(in years)', 'Expiry date', 'Status'];

const createEmptyRow = () => ({
    id: '',
    source: '',
    validity: '',
    expiry: '',
    status: '',
});


export function InsuranceDetails() {
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