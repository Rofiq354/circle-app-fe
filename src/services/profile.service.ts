import api from "@/api/axios";

export interface UsersFollow {
  id: number;
  username: string;
  fullname: string;
  photo_profile: string | null;
  cover_photo: string | null;
  bio: string;
  isFollowed: boolean;
  threads_count: number;
  following_count: number;
  follower_count: number;
}

export interface UsersResponse {
  message: string;
  data: UsersFollow[];
}

export interface UserProfileResponse {
  message: string;
  data: UsersFollow;
}

export const getUsersSuggested = async (
  page: number,
  limit: number,
): Promise<UsersFollow[]> => {
  const res = await api.get<UsersResponse>(
    `/users?page=${page}&limit=${limit}&type=suggested`,
  );
  return res.data.data;
};

export const getUsersBySearch = async (
  search: string,
): Promise<UsersFollow[]> => {
  const res = await api.get<UsersResponse>(`/users/search?keyword=${search}`);
  return res.data.data;
};

export const getUsersByUsername = async (
  username: string,
): Promise<UsersFollow> => {
  const res = await api.get<UserProfileResponse>(`/profile/${username}`);
  return res.data.data;
};
