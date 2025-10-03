export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Customer = 'Customer',
}
