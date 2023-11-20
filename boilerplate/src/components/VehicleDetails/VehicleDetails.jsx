import React from 'react';
import { EditableTable } from '../EditableTable/EditableTable';

const title = 'Vehicle Details';



const initialData = [];

const headerData = ['Name', 'VIN/Chassis no.', 'Product Type', 'Validity(in years)', 'Expiry date', 'Status'];

const createEmptyRow = () => ({
    id: '',
    name: '',
    vin: '',
    product_type: '',
    validity: '',
    expiry: '',
    status: '',
});


export function VehicleDetails() {
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