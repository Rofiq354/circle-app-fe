import api from "@/api/axios";
import type { Reply } from "@/types/reply";

export interface GetThreadsResponse {
  code: number;
  success?: boolean;
  message: string;
  data: {
    replies: Reply[];
  };
}

export const getAllRepliesByThreadId = async (thread_id: number): Promise<Reply[]> => {
  const res = await api.get<GetThreadsResponse>(`/reply?thread_id=${thread_id}`);
  return res.data.data.replies;
};