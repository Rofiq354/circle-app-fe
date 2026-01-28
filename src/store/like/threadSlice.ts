import type { Thread } from "@/types/threads";
import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "..";
import { toggleLikeAction } from "./threadThunk";

const threadsAdapter = createEntityAdapter<Thread>({
  sortComparer: (a, b) => b.id - a.id,
});

const initialState = threadsAdapter.getInitialState({
  loading: false,
  isModalOpen: false,
});

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    // Render untuk set data awal dari API
    setThreads: (state, action) => {
      threadsAdapter.setAll(state, action.payload);
      state.loading = false;
    },
    addSingleThread: threadsAdapter.addOne,
    // OPTIMISTIC UPDATE
    localToggleLike: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const thread = state.entities[id];

      if (thread) {
        thread.isLiked = !thread.isLiked;
        thread.likes += thread.isLiked ? 1 : -1;
      }
    },
    updateLikesFromSocket: (
      state,
      action: PayloadAction<{ threadId: number; likesCount: number }>,
    ) => {
      const { threadId, likesCount } = action.payload;
      const thread = state.entities[threadId];
      if (thread) {
        thread.likes = likesCount;
      }
    },

    incrementReplyCount: (state, action: PayloadAction<number>) => {
      const threadId = action.payload;
      const thread = state.entities[threadId];
      if (thread) {
        thread.reply = (thread.reply || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLikeAction.fulfilled, (state, action) => {
      const id = action.meta.arg;
      const thread = state.entities[id];
      if (thread && action.payload) {
        thread.isLiked = action.payload.isLiked;
      }
    });
    builder.addCase(toggleLikeAction.rejected, (state, action) => {
      // ROLLBACK: Jika server error, balikkan state ke posisi semula
      const threadId = action.meta.arg;
      const thread = state.entities[threadId];
      if (thread) {
        thread.isLiked = !thread.isLiked;
        thread.likes += thread.isLiked ? 1 : -1;
      }
    });
  },
});

export const selectThreadImage = (state: RootState, id: number) => {
  const thread = state.threads.entities[id];
  if (!thread) return null;
  return thread.image || thread.image_url || thread.images || null;
};

export const { selectAll: selectAllThreads, selectById: selectThreadById } =
  threadsAdapter.getSelectors((state: RootState) => state.threads);

const selectAllThreadsData = (state: RootState) => selectAllThreads(state);

// Selector memoized
export const selectThreadsByUserId = createSelector(
  [selectAllThreadsData, (_, userId: number | undefined) => userId],
  (allThreads, userId) => {
    if (!userId) return [];
    return allThreads.filter((thread) => thread.user?.id === userId);
  },
);

export const {
  openModal,
  closeModal,
  setThreads,
  localToggleLike,
  addSingleThread,
  updateLikesFromSocket,
  incrementReplyCount,
} = threadSlice.actions;
export default threadSlice.reducer;
