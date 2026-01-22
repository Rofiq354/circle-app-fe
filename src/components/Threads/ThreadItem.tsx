import type { ThreadItemProps } from "@/types/threads";
import { HeartIcon, MessagesSquare } from "lucide-react";

export const ThreadItem: React.FC<ThreadItemProps> = ({
  id,
  user,
  content,
  likes,
  reply,
  created_at,
  images,
  isLiked,
  onLike,
}) => {
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `${seconds} detik yang lalu`;
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="border-b border-[#333] p-4">
      <div className="flex gap-3">
        <img
          src={user.profile_picture}
          alt="avatar"
          className="w-10 h-10 rounded-full bg-white"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white capitalize">
              {user.fullname}
            </span>
            <span className="text-[#777] lowercase">@{user.username}</span>
            <span className="text-[#777]">• {timeAgo(created_at ?? "")}</span>
          </div>

          <p className="text-[#bfbfbf] mt-2">{content}</p>

          {images && (
            <div className="mt-3 w-4/5">
              <img
                src={`${images}`}
                alt="thread image"
                className="rounded-xl w-full max-h-87.5 bg-white object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6 mt-3">
            <div
              className="flex items-center gap-2 text-[#777] cursor-pointer"
              onClick={() => onLike?.(id as number)}
            >
              <HeartIcon
                className={`w-5 h-5 ${isLiked ? "text-red-500 fill-red-500 scale-110" : "text-[#777]"}`}
              />
              <span className={`${isLiked ? "text-white" : "text-[#777]"}`}>
                {likes}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#777]">
              <MessagesSquare className="w-5 h-5" />
              <span>{reply === 0 ? "" : reply} Replies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ThreadSkeleton = () => {
  return (
    <div className="border-b border-[#333] p-4 animate-pulse">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />

        <div className="flex-1">
          {/* Header: fullname, username, time */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-[#2a2a2a] rounded" />
            <div className="h-3 w-20 bg-[#2a2a2a] rounded" />
            <div className="h-3 w-16 bg-[#2a2a2a] rounded" />
          </div>

          {/* Content */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full bg-[#2a2a2a] rounded" />
            <div className="h-4 w-5/6 bg-[#2a2a2a] rounded" />
            <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
          </div>

          {/* Image skeleton */}
          <div className="mt-4 w-4/5 h-55 bg-[#2a2a2a] rounded-xl" />

          {/* Actions */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#2a2a2a]" />
              <div className="h-3 w-6 bg-[#2a2a2a] rounded" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#2a2a2a]" />
              <div className="h-3 w-20 bg-[#2a2a2a] rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
