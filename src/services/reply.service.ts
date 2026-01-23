import api from "@/api/axios";
import type { Reply } from "@/types/reply";

export interface GetThreadsResponse {
  code: number;
  success?: boolean;
  status?: string;
  message: string;
  data: {
    replies: Reply[];
    tweet: Reply;
  };
}

export const getAllRepliesByThreadId = async (
  thread_id: number,
): Promise<Reply[]> => {
  const res = await api.get<GetThreadsResponse>(
    `/reply?thread_id=${thread_id}`,
  );
  return res.data.data.replies;
};

export const createRepliesByThreadId = async (
  thread_id: number,
  content: string,
): Promise<Reply> => {
  const res = await api.post<GetThreadsResponse>(
    `/reply?thread_id=${thread_id}`,
    { content },
  );
  return res.data.data.tweet;
};
