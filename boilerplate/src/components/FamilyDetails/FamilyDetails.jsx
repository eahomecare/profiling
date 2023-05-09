import React from 'react';
import { EditableTable } from '../EditableTable/EditableTable';

const title = 'Family Details';



const initialData = [
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
        name: 'Anand Sharma',
        gender: 'Male',
        relationship: 'Son',
        phone: '+91 873624782',
        email: 'anandsharma123@email.com',
    },
    {
        id: '3',
        name: 'Sarthak Sharma',
        gender: 'Male',
        relationship: 'Son',
        phone: '-',
        email: '-',
    },
];

const headerData = ['Name', 'Gender', 'Relationship', 'Phone No.', 'Email Address', '', ''];

const createEmptyRow = () => ({
    id: '',
    name: '',
    gender: '',
    relationship: '',
    phone: '',
    email: '',

});


export function FamilyDetails() {
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