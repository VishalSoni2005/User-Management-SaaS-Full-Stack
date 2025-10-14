/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessToken } from "@/lib/auth";
import { User } from "@/types/user.type";

// 🧠 Define the state shape
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};


export const fetchAllUsers = createAsyncThunk<
  User[], // Return type
  void, // Argument type
  { rejectValue: string } // Rejection type
>("user/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    const res = await axios.get<{ data: User[] }>(
      "http://localhost:4000/users/getallusers",
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    console.log("Fetched users from API:", res.data.data);
    return res.data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to fetch users";
    return rejectWithValue(message);
  }
});

// 2️⃣ Delete User
export const deleteUser = createAsyncThunk<
  string, // Return type (userId)
  string, // Argument type (userId)
  { rejectValue: string } // Rejection type
>("user/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    await axios.delete(`http://localhost:4000/users/deleteuser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userId;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to delete user";
    return rejectWithValue(message);
  }
});

// 3️⃣ Update User
export const updateUser = createAsyncThunk<
  User, // Return type
  { id: string; data: User }, // Argument type
  { rejectValue: string } // Rejection type
>("user/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    console.log("user from updateuser : ", data);
    
    const res = await axios.put<{ data: User }>(
      `http://localhost:4000/users/edituser/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Updated user:", res.data.data);
    return res.data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to update user";
    return rejectWithValue(message);
  }
});

// 🧩 --- Slice --- 🧩

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUsers(state) {
      state.users = [];
      state.error = null;
      state.loading = false;
    },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong fetching users";
      })

      // 🔹 Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? "Something went wrong deleting user";
      })

      // 🔹 Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload ?? "Something went wrong updating user";
      });
  },
});

// 🧩 --- Exports ---
export const { clearUsers, setUsers } = userSlice.actions;
export default userSlice.reducer;
