export interface User {
  id: string;
  firstName: string;
  lastName?: string; // optional if not always present
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string; // ISO date string
}
