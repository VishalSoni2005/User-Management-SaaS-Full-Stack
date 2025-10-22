export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;

  avatar: string;
  totalPoints: number;
}
export interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "ADMIN" | "USER";
  avatar: string;
  createdAt: string;

  rank: number;
  totalPoints: number;
}

export interface UserPayload {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "ADMIN" | "USER";
  exp: number;

  avatar: string;
  totalPoints: number;
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
