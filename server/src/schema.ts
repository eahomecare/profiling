export interface User {
  id: string;
  email: string;
  hash: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface Customer {
  id: string;
  mobile: string;
  other_mobile?: any;
  email?: string;
  other_email?: any;
  source: number;
  profiling?: any;
  keys?: string[];
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
  personal_details?: Personal_Details;
}

export interface Personal_Details {
  id: string;
  customer: Customer;
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

export interface Keyword {
  id: string;
  category: string;
  value: string;
  customerIDs: string[];
  customers: Customer;
}

export interface Occupation {
  id: string;
  type: string;
  industry: string;
  to: string;
  from: string;
  incomeBracket: string;
  customerIDs: string[];
  customers: Customer;
}
