import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import threadSlice from "./like/threadSlice";
import replySlice from "./reply/replySlice";
import profileSlice from "./profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    threads: threadSlice,
    replies: replySlice,
    profile: profileSlice,
  },
});

// tipe global
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
