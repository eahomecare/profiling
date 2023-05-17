import React from 'react';
import { Select } from '@mantine/core';

interface CustomSelectInputProps {
    value: string | null;
    onChange: (value: string) => void;
    data: { value: string; label: string }[];
}

export const CustomSelectInput: React.FC<CustomSelectInputProps> = ({ value, onChange, data }) => {
    return <Select data={data} value={value || ''} onChange={(value) => onChange(value)} />;
};