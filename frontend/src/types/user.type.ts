export interface User {
  id: string;
  firstName: string;
  lastName?: string; // optional if not always present
  email: string;
  role: "ADMIN" | "USER";
  avatar: string;
  createdAt: string; // ISO date string
}

export interface UserPayload {
  id: string;
  firstName: string;
  lastName?: string; // optional if not always present
  email: string;
  role: "ADMIN" | "USER";
  avatar: string;
  createdAt: string;
}

export interface UserState {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  currentUser: User | null; 
  error: string | null;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
