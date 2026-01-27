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

export interface Followers {
  id: number;
  username: string;
  fullname: string;
  photo_profile: string | null;
  bio: string;
  isFollowing: boolean;
}

export interface FollowersResponse {
  status: string;
  data: {
    followers: Followers[];
  };
}

export const toggleFollow = async (
  targetUserId: number,
): Promise<FollowResponse> => {
  const res = await api.post<FollowResponse>(`/follows/${targetUserId}`);
  return res.data;
};

export const getUsersFollowers = async (
  userId: number,
  type: string,
): Promise<Followers[]> => {
  const res = await api.get<FollowersResponse>(`/follows/${userId}/${type}`);
  return res.data.data.followers;
};
