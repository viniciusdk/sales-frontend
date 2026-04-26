export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  active: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
