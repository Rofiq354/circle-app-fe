import api from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const authLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/logout");
      return res.data.data;
    } catch {
      return rejectWithValue(null);
    }
  },
);
