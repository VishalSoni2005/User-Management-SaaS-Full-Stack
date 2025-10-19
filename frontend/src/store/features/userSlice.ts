/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAccessToken } from "@/lib/get-access-toke.lib";
import { UpdateUser, User, UserState } from "@/types/user.type";
import { axiosInstance } from "@/api/axiosInstance";

const initialState: UserState = {
  users: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  currentUser: null,
};

export const fetchAllUsers = createAsyncThunk<
  { data: User[]; total: number; page: number; totalPages: number }, // Return type
  { limit: number; page: number }, // Argument type
  { rejectValue: string } // Rejection type
>("user/fetchAllUsers", async ({ limit, page }, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    const res = await axios.get(
      `http://localhost:4000/users/getallusers?limit=${limit}&page=${page}`,
      // API_ENDPOINT.GET_ALL_USERS,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined, //* token going from here is access token
      }
    );

    return {
      data: res.data.data,
      total: res.data.meta.total,
      page: res.data.meta.page,
      totalPages: res.data.meta.totalPages,
    };
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to fetch users";
    return rejectWithValue(message);
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
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

export const updateUser = createAsyncThunk<
  User, // Return type
  { id: string; data: UpdateUser },
  { rejectValue: string }
>("user/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = getAccessToken();
    const res = await axiosInstance.put<{ data: User }>(
      `/users/updateuser/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.data.data) {
      throw new Error("Failed to update user");
    }

    console.log("user after updation : ", res.data);

    return res.data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err.message || "Failed to update user";
    return rejectWithValue("Error updating user: " + message);
  }
});

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
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    },
  },
  //! extraReducers for async thunks
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong fetching users";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? "Something went wrong deleting user";
      })
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

export const { clearUsers, setUsers, setCurrentUser, clearCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
