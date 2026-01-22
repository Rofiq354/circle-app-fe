import api from "@/api/axios";
import type { GetOneThreadById, Thread, Tweet } from "@/types/threads";

export interface GetThreadsResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    threads: Thread[];
  };
}

export interface GetOneThreadResponse {
  code: number;
  status: string;
  message: string;
  data?: GetOneThreadById;
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
  const res = await api.get(`/thread/${id}`);
  // return res.data.data.threads[0];
  return res.data.data;
};

export const createThread = async (
  formData: FormData,
): Promise<CreateThreadsResponse> => {
  const res = await api.post("/thread", formData);
  return res.data;
};
