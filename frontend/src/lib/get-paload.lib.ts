// import { axiosInstance } from "@/api/axiosInstance";
// import { UserPayload } from "@/types";
// import { jwtDecode } from "jwt-decode";

// export const getPayload = async (): Promise<UserPayload | null> => {
//   if (typeof window === "undefined") return null;

//   const token = localStorage.getItem("access_token");
//   if (!token) {
//     // no token at all — maybe user is fresh
//     return null;
//   }

//   try {
//     const decoded: UserPayload = jwtDecode(token);

//     // ✅ Check if expired
//     const isExpired = decoded?.exp && decoded.exp * 1000 < Date.now();

//     if (!isExpired) {
//       return decoded; // token valid
//     }

//     // 🔄 If expired — try to refresh it
//     const newToken = await refreshAccessToken();

//     if (newToken) {
//       localStorage.setItem("access_token", newToken);
//       const newDecoded: UserPayload = jwtDecode(newToken);
//       return newDecoded;
//     } else {
//       // refresh failed — clear old token
//       localStorage.removeItem("access_token");
//       return null;
//     }
//   } catch (err) {
//     console.error("Error decoding token:", err);
//     localStorage.removeItem("access_token");
//     return null;
//   }
// };

// // ✅ Helper to call backend refresh endpoint
// const refreshAccessToken = async (): Promise<string | null> => {
//   try {
//     const res = await axiosInstance("/auth/refresh", {
//       method: "POST",
//       withCredentials: true, // send cookies
//     });

//     const data = res.data;

//     // your backend should return { accessToken: "..." }
//     return data?.access_token || null;
//   } catch (err) {
//     console.error("Refresh failed:", err);
//     return null;
//   }
// };

// import { UserPayload } from "@/types";
// import { jwtDecode } from "jwt-decode";

// export const getPayload = (): UserPayload | null => {
//   if (typeof window === "undefined") return null;

//   const token = localStorage.getItem("access_token");
//   if (!token) return null;

//   try {
//     const decoded: UserPayload = jwtDecode(token);

//     // ✅ Check if token expired
//     if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
//       console.warn("Access token expired");
//       localStorage.removeItem("access_token"); // remove expired token
//       return null;
//     }

//     console.log("decoded", decoded);

//     return decoded;
//   } catch (err) {
//     console.error("Error decoding token:", err);
//     localStorage.removeItem("access_token"); // corrupted or invalid token
//     return null;
//   }
// };

import { UserPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export const getPayload = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  // console.log("token from lib", token);

  if (!token) return null;

  try {
    const decoded: UserPayload | null = jwtDecode(token);
    console.log("decoded", decoded);

    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
