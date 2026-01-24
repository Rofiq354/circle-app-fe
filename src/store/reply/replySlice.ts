import type { Reply } from "@/types/reply";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "..";

const repliesAdapter = createEntityAdapter<Reply>({
  sortComparer: (a, b) =>
    (b.created_at as string).localeCompare(String(a.created_at)),
});

const replySlice = createSlice({
  name: "replies",
  initialState: repliesAdapter.getInitialState(),
  reducers: {
    setReplies: repliesAdapter.setAll,
    addReply: repliesAdapter.addOne,
  },
});

export const selectReplyImage = (state: RootState, id: number) => {
  const reply = state.threads.entities[id];
  if (!reply) return null;
  return reply.image || reply.image_url || reply.images || null;
};

export const { setReplies, addReply } = replySlice.actions;

export const { selectAll: selectAllReplies } = repliesAdapter.getSelectors(
  (state: RootState) => state.replies,
);

export default replySlice.reducer;
