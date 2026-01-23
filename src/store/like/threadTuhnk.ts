import api from "@/api/axios";
import type { Thread } from "@/types/threads";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
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

interface ThreadState {
  threads: Thread[];
}

const initialState: ThreadState = {
  threads: [],
};

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    // Render untuk set data awal dari API
    setThreads: (state, actions: PayloadAction<Thread[]>) => {
      state.threads = actions.payload;
    },
    addSingleThread: (state, action: PayloadAction<Thread>) => {
      // Menambahkan 1 thread baru ke posisi paling depan (index 0)
      state.threads = [action.payload, ...state.threads];
    },
    // OPTIMISTIC UPDATE
    localToggleLike: (state, action: PayloadAction<number>) => {
      const targetId = Number(action.payload);
      const thread = state.threads.find((t) => Number(t.id) === targetId);

      if (thread) {
        if (thread.isLiked) {
          thread.likes -= 1;
          thread.isLiked = false;
        } else {
          thread.likes += 1;
          thread.isLiked = true;
        }
      } else {
        console.log("Thread tidak ditemukan di state!");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLikeAction.fulfilled, (state, action) => {
      const thread = state.threads.find(
        (t) => t.id === action.payload?.threadId,
      );
      if (thread) {
        thread.isLiked = action.payload?.isLiked;
      }
    });
    builder.addCase(toggleLikeAction.rejected, (state, action) => {
      // ROLLBACK: Jika server error, balikkan state ke posisi semula
      const threadId = action.meta.arg;
      const thread = state.threads.find((t) => t.id === threadId);
      if (thread) {
        thread.isLiked = !thread.isLiked;
        thread.likes += thread.isLiked ? 1 : -1;
      }
    });
  },
});

export const { setThreads, localToggleLike, addSingleThread } =
  threadSlice.actions;
export default threadSlice.reducer;
