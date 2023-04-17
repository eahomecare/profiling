import React, { createContext, useEffect, useState } from 'react';
import { getCustomerById } from './customer';

interface Customer {
    id: string;
    mobile: string;
    other_mobile?: any;
    email?: string;
    other_email?: any;
    source: number;
    profiling?: any;
    keys?: string[];
    profile_completion?: number;
    created_at: Date;
    updated_at: Date;
    created_by?: string;
    updated_by?: string;
    personal_details?: Personal_Details;
}

interface Personal_Details {
    id: string;
    customer_id: string;
    full_name?: string;
    address?: string;
    phone_number?: string;
    email_address?: string;
    date_of_birth?: string;
    employment?: string;
    location?: string;
    anniversary?: string;
}

interface CustomerContextProps {
    customerContext: Customer | null;
    setCustomerContext: React.Dispatch<React.SetStateAction<Customer | null>>;
}

const CustomerContext = createContext<CustomerContextProps>({
    customerContext: null,
    setCustomerContext: () => { },
});

export const CustomerProvider: any = ({ children }: any) => {
    const [customerContext, setCustomerContext] = useState<Customer | null>(null);

    useEffect(() => {
        console.log('customer changed in context', customerContext)
    })

    return (
        <CustomerContext.Provider value={{ customerContext, setCustomerContext }}>
            {children}
        </CustomerContext.Provider>
    );
};

export default CustomerContext;

// import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
// import { getToken } from "./auth";
// import { getCustomerById } from "./customer";

// export interface Customer {
//     id: string;
//     mobile: string;
//     other_mobile?: any;
//     email?: string;
//     other_email?: any;
//     source: number;
//     profiling?: any;
//     keys?: string[];
//     created_at: Date;
//     updated_at: Date;
//     created_by?: string;
//     updated_by?: string;
//     personal_details?: Personal_Details;
// }

// export interface Personal_Details {
//     id: string;
//     customer: Customer;
//     customer_id: string;
//     full_name?: string;
//     address?: string;
//     phone_number?: string;
//     email_address?: string;
//     date_of_birth?: string;
//     employment?: string;
//     location?: string;
//     anniversary?: string;
// }

// export interface CustomerContext {
//     customer: Customer
// }

// export const CustomerContext = createContext<Partial<CustomerContext>>({})

// type CustomerProvideProps = {
//     children: ReactNode,
//     customerId: string
// }


// export default function CustomerProvider({ children, customerId }: CustomerProvideProps) {
//     const [customer, setCustomer] = useState<Customer>()
//     useEffect(() => {
//         getCustomerById(customerId).then((res: CustomerContext) => {
//             setCustomer(res.customer)
//         })
//     }, [])
//     console.log('Customer context provider just ran!')
//     return (
//         <CustomerContext.Provider value={{ customer }}>
//             {children}
//         </CustomerContext.Provider>
//     )
// }

// export const useCustomerContext = () => useContext(CustomerContext)

