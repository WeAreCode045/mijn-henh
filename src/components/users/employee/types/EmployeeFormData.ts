
export interface EmployeeFormData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  whatsapp_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role: 'admin' | 'agent';
  agency_id?: string;
}

export interface EmployeeUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  whatsapp_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role?: 'admin' | 'agent';
  agency_id?: string;
}
