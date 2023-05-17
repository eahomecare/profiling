import React, { useState } from 'react';
import { Divider, Text } from '@mantine/core';
import { BankDetails } from './BankDetails';
import IdentityCard from './IdentityCard';

interface Data {
    title: string;
    subTitle: string;
    detail: string;
}

const data: Data[] = [
    {
        title: 'Aadhar Card',
        subTitle: 'Aadhar Card',
        detail: 'AC xxxxxxxxxxxx-xxx',
    },
    {
        title: 'Pan Card',
        subTitle: 'Pan Card',
        detail: 'PAN xxxxxxxxxxxx-xxx',
    },
];

const FinancialInformation: React.FC = () => {
    const [identityData, setIdentityData] = useState<Data[]>(data);

    const updateDetail = (index: number, newValue: string) => {
        setIdentityData((prevState) =>
            prevState.map((item, idx) => (idx === index ? { ...item, detail: newValue } : item)),
        );
    };

    return (
        <>
            <BankDetails />
            <Text mt={30} fw={700}>{'Identity Details'}</Text>
            {identityData.map((item, index) => (
                <React.Fragment key={item.title}>
                    <IdentityCard
                        title={item.title}
                        subTitle={item.subTitle}
                        detail={item.detail}
                        index={index}
                        onUpdateDetail={updateDetail}
                    />
                    <Divider my="md" size={'xs'} color={'#4E70EA'} />
                </React.Fragment>
            ))}
        </>
    );
};

export default FinancialInformation;