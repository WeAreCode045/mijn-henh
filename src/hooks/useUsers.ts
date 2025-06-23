
import { useEmployeeManagement } from "@/hooks/users/employee/useEmployeeManagement";

export function useUsers() {
  const { users: employees, isLoading, error } = useEmployeeManagement();
  
  // Transform the employee data to match the expected User format
  const users = employees?.map(employee => ({
    id: employee.id,
    email: employee.email,
    full_name: employee.full_name || employee.display_name || '',
    first_name: employee.first_name || '',
    last_name: employee.last_name || '',
    role: employee.role,
    type: employee.type
  })) || [];

  return {
    users,
    isLoading,
    error
  };
}
