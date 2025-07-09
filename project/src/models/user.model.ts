export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdDate: Date;
}

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}