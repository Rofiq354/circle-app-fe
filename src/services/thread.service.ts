import api from "@/api/axios";
import type { Thread, Tweet } from "@/types/threads";

export interface GetThreadsResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    threads: Thread[];
  };
}

export interface CreateThreadsResponse {
  code: number;
  status: string;
  message: string;
  data: {
    tweet: Tweet;
  };
}

export const getAllThreads = async (): Promise<Thread[]> => {
  const res = await api.get<GetThreadsResponse>("/thread");
  return res.data.data.threads;
};

export const getThreadById = async (id: number): Promise<Thread> => {
  const res = await api.get<GetThreadsResponse>(`/thread/${id}`);
  return res.data.data.threads[0];
};

export const createThread = async (
  formData: FormData,
): Promise<CreateThreadsResponse> => {
  const res = await api.post("/thread", formData);
  return res.data;
};
