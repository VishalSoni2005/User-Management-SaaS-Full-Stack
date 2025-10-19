/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/api/axiosInstance";
import { LoginFormData, SignupFormData, User } from "@/types";

// Login API
export const loginUser = createAsyncThunk<
  { user: User; access_token: string },
  LoginFormData,
  { rejectValue: string }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    return { user: res.data.user, access_token: res.data.access_token };
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Login failed";
    return rejectWithValue(message);
  }
});

// Signup API
export const signupUser = createAsyncThunk<
  { user: User; access_token: string },
  SignupFormData,
  { rejectValue: string }
>("auth/signupUser", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    return { user: res.data.user, access_token: res.data.access_token };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Signup failed";
    return rejectWithValue(message);
  }
});

// slice
interface AuthState {
  access_token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  access_token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;