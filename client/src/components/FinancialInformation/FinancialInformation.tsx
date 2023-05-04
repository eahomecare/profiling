import React from 'react';
import { Divider } from '@mantine/core';
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
    return (
        <>
            <BankDetails />
            {data.map((item) => (
                <React.Fragment key={item.title}>
                    <Divider my="md" size={'xs'} color={'#4E70EA'} />
                    <IdentityCard title={item.title} subTitle={item.subTitle} detail={item.detail} />
                </React.Fragment>
            ))}
        </>
    );
};

export default FinancialInformation;