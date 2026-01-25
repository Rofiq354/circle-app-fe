import api from "@/api/axios";

export interface Follow {
  user_id: number;
  is_followed: boolean;
}

export interface FollowResponse {
  code: number;
  message: string;
  data: Follow;
}

export const toggleFollow = async (
  targetUserId: number,
): Promise<FollowResponse> => {
  const res = await api.post<FollowResponse>(`/follows/${targetUserId}`);
  return res.data;
};
