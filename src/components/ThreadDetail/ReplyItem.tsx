import React, { memo, useState } from "react";
import { Heart as HeartIcon, MessagesSquare, User } from "lucide-react";
import type { Reply } from "@/types/reply";
import { timeAgo } from "@/lib/times";
import { Link } from "react-router-dom";

const ReplyItem: React.FC<Reply> = memo(
  ({ user, content, image, image_url, created_at }) => {
    const [isError, setIsError] = useState(false);
    const imageUrl = image || image_url;
    const isLiked = false;
    const likes = 0;
    const replies = 0;

    const imageIcon = (
      <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
        <User size={20} className="text-[#777]" />
      </div>
    );

    return (
      <div className="w-full bg-inherit">
        {/* Content Parent */}
        <div className="border-b border-[#333] py-4 px-7">
          <div className="flex gap-3">
            <div className="relative cursor-pointer">
              {(user?.profile_picture || user?.photo_profile) && !isError ? (
                <img
                  src={
                    (user?.profile_picture as string) ||
                    (user?.photo_profile as string)
                  }
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
                <Link to={`/profile/${user?.username || "anonymous"}`}>
                  <span className="font-medium text-white capitalize hover:underline">
                    {user?.fullname || user?.name || "Unknown User"}
                  </span>
                </Link>
                <span className="text-[#777] lowercase">
                  @{user?.username || "anonymous"}
                </span>
                <span className="text-[#777] flex items-center gap-2">
                  <span className="text-2xl text-inherit">•</span>{" "}
                  {timeAgo(created_at as string)}
                </span>
              </div>

              <p className="text-[#bfbfbf] mt-2 whitespace-pre-wrap leading-relaxed">
                {content}
              </p>

              {imageUrl && (
                <div className="mt-3 w-4/5">
                  <img
                    src={imageUrl || ""}
                    alt="thread image"
                    className="rounded-xl w-full max-h-87.5 bg-white object-cover border border-[#333]"
                  />
                </div>
              )}

              <div className="flex items-center gap-6 mt-3">
                {/* Like Button */}
                <div className="flex items-center gap-2 text-[#777] cursor-pointer group">
                  <HeartIcon
                    className={`w-5 h-5 transition-transform active:scale-125 ${
                      isLiked
                        ? "text-red-500 fill-red-500 scale-110"
                        : "text-[#777]"
                    }`}
                  />
                  <span className={`${isLiked ? "text-white" : "text-[#777]"}`}>
                    {likes < 1 ? "" : likes}
                  </span>
                </div>

                {/* Reply Info */}
                <div className="flex items-center gap-2 text-[#777] cursor-pointer hover:text-blue-400 transition-colors">
                  <MessagesSquare className="w-5 h-5" />
                  <span>{replies === 0 ? "" : replies} Replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ReplyItem;
