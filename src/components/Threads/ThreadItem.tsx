import { timeAgo } from "@/lib/times";
import type { AppDispatch, RootState } from "@/store";
import { localToggleLike, selectThreadById } from "@/store/like/threadSlice";
import { toggleLikeAction } from "@/store/like/threadThunk";
import type { ThreadItemProps } from "@/types/threads";
import { HeartIcon, MessagesSquare, User } from "lucide-react";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const ThreadItem: React.FC<ThreadItemProps> = memo(
  ({ id, user, content, reply, created_at, images }) => {
    const navigate = useNavigate();
    const thread = useSelector((state: RootState) =>
      selectThreadById(state, id),
    );
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const isLiked = thread?.isLiked;
    const likes = thread?.likes;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/profile/${user?.username}`);
    };

    const toggleLike = () => {
      dispatch(localToggleLike(id));
      dispatch(toggleLikeAction(id));
    };

    const imageIcon = (
      <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
        <User size={20} className="text-[#777]" />
      </div>
    );

    return (
      <div className="p-4 relative hover:bg-white/2 transition">
        <Link to={`/thread/${id}`}>
          <div className="flex gap-3">
            <div className="relative z-20 cursor-pointer" onClick={handleClick}>
              {user?.photo_profile && !isError ? (
                <img
                  src={user?.photo_profile as string}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover bg-[#333]"
                  onError={() => setIsError(true)}
                />
              ) : (
                imageIcon
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-white capitalize hover:underline"
                  onClick={handleClick}
                >
                  {user?.fullname}
                </span>
                <span className="text-[#777] lowercase">@{user?.username}</span>
                <span className="text-[#777]">
                  • {timeAgo(created_at ?? "")}
                </span>
              </div>

              <p className="text-[#bfbfbf] mt-2">{content}</p>

              {(images as string) && (
                <div className="mt-3 w-4/5">
                  <img
                    src={`${images as string}`}
                    alt="thread image"
                    className="rounded-xl w-full max-h-87.5 bg-white object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-6 mt-3">
                <div
                  className="flex items-center gap-2 text-[#777] cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike();
                  }}
                >
                  <HeartIcon
                    className={`w-5 h-5 transition-transform active:scale-150 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-[#777]"}`}
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
        </Link>
      </div>
    );
  },
);

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
