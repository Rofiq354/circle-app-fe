import api from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/profile");
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue("unauthorized");
      }
      throw err;
    }
  },
);
