import type { Followers } from "@/services/follower.service";
import { User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  user: Followers;
  onFollow: () => void;
}

const UserFollowItem: React.FC<Props> = ({ user, onFollow }) => {
  const [isError, setIsError] = useState(false);
  const imageIcon = (
    <div className="w-14 h-14 rounded-full bg-[#333] z-0 flex items-center justify-center border border-[#444]">
      <User size={20} className="text-[#777]" />
    </div>
  );

  return (
    <div key={user.id} className="flex items-start justify-between group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative cursor-pointer">
          {user?.photo_profile && !isError ? (
            <img
              src={user?.photo_profile as string}
              alt="avatar"
              className="w-14 h-14 rounded-full bg-blue-400 object-cover"
              onError={() => setIsError(true)}
            />
          ) : (
            imageIcon
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <div className="flex flex-col">
            <Link to={`/profile/${user.username}`}>
              <span className="font-bold text-lg leading-tight hover:underline">
                {user.fullname}
              </span>
            </Link>
            <span className="text-gray-500">@{user.username}</span>
          </div>
          <p className="mt-1 text-gray-300 text-base">{user.bio}</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onFollow}
        className={`px-6 py-1.5 rounded-full font-semibold transition-colors ${
          user.isFollowing
            ? "border border-green-600 text-green-400/60 cursor-pointer hover:bg-green-600/10 hover:text-white"
            : "bg-green-600 text-white cursor-pointer hover:bg-green-700"
        }`}
      >
        {user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default UserFollowItem;
