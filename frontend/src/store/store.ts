import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      auth: authReducer,
    },
    // devTools: true by default in development
  });

// For typing
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
