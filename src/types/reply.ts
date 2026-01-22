import type { User } from "./user";

export interface Reply {
  id: string | number;

  content?: string;
  message?: string;

  image?: string;
  images?: string[];

  createdAt?: string;
  created_at?: string;

  updatedAt?: string;
  updated_at?: string;

  userId?: number;
  user: User;

  threadId?: number;
}