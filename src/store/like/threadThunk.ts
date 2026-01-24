import api from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const toggleLikeAction = createAsyncThunk(
  "threads/toggleLike",
  async (threadId: number, { rejectWithValue }) => {
    try {
      const res = await api.post(`/like`, { tweet_id: threadId });
      return { threadId, isLiked: res.data.isLiked };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return rejectWithValue(err.response?.data);
        }
      }
      return rejectWithValue("Terjadi kesalahan sistem");
    }
  },
);
