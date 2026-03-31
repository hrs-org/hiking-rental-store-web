export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 'Admin',
  Owner = 'Owner',
  Manager = 'Manager',
  Employee = 'Employee',
  Customer = 'Customer',
}
