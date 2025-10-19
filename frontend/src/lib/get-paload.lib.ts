import { UserPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export const getPayload = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  // console.log("token from lib", token);
  
  if (!token) return null;

  try {
    const decoded: UserPayload | null = jwtDecode(token);
    // console.log("decoded", decoded);
    
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
