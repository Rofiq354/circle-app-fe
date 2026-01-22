import type { User, UserProps } from "./user";

export interface Thread {
  id: number;
  content: string;
  images: string | null;
  image?: string;
  user: User;
  created_at: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

export interface Tweet {
  content: string;
  id: number;
  image_url: null | string;
  timestamp: string;
  user_id: string;
  user?: User;
}

export interface ThreadItemProps {
  id: number;
  content?: string;
  images?: string[] | string | null | undefined;
  user: UserProps;
  likes: number;
  reply?: number;
  created_at?: string;
  isLiked?: boolean;
  onLike?: (id: number) => void;
}

export interface ThreadComposerProps {
  value?: string;
  onChange?: (value: string) => void;
  onPost?: (name: string) => void;
  inputClick?: () => void;
  onAttach?: () => void;
  placeholder?: string;
  isPosting?: boolean;
  className?: string;
}

export interface ThreadContextType {
  threads: Thread[];
  addThread?: (content: string) => void | object;
  loading: boolean;
  refreshThreads: () => Promise<void>;
  toggleLike: (threadId: number) => void;
}

export interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string; // Tambahan
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // Tambahan
  selectedImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onPost: () => void;
}

export interface GetOneThreadById {
  id: number,
  content: string,
  image?: string | null,
  likes: number,
  replies: number
  created_at: string,
  user?: User
  isLiked?: boolean
}
