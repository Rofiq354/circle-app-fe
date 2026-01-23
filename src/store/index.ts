import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import threadSlice from "./like/threadTuhnk";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    threads: threadSlice,
  },
});

// tipe global
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
