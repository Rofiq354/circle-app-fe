export interface UserProps {
  id?: number;
  username?: string;
  fullname?: string;
  profile_picture?: string;
}
export interface User {
  id?: number;
  userId?: number;

  fullname?: string;
  name?: string;

  username?: string;

  profile_picture?: string | null;
  photo_profile?: string | null;

  cover_photo: string | null;
  following_count: number;
  follower_count: number;
  likes_count: number;
  
  threads_count: number;
  threads: number;

  bio: string | null;

  email?: string;
}
