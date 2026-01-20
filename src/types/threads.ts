import type { UserProps } from "./user";

export interface ThreadItemProps {
  id: number;
  content?: string;
  images?: string[] | string | null | undefined;
  user: UserProps;
  likes: number;
  replies?: number;
  created_at?: string | undefined;
  isLiked?: boolean;
  onLike?: (id: number) => void;
}

export interface ThreadComposerProps {
  value: string;
  onChange: (value: string) => void;
  onPost: () => void;
  onAttach?: () => void;
  placeholder?: string;
  isPosting?: boolean;
  className?: string;
}
