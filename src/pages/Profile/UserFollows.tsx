import UserFollowItem from "@/components/Users/UserFollowItem";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  type Followers,
  getUsersFollowers,
  toggleFollow,
} from "@/services/follower.service";
import { toggleFollowOptimistic } from "@/store/profile/profileSlice";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  isFollowing: boolean;
}

// const mockFollowers: User[] = [
//   {
//     id: "1",
//     name: "rach",
//     username: "fortherAch",
//     bio: "All for Jesus and the A #GoBraves",
//     avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
//     isFollowing: false,
//   },
//   {
//     id: "2",
//     name: "rach",
//     username: "Rache243",
//     bio: "catch me @ a concert or behind a bar",
//     avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
//     isFollowing: false,
//   },
//   {
//     id: "3",
//     name: "rach",
//     username: "fortherAch",
//     bio: "All for Jesus and the A #GoBraves",
//     avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
//     isFollowing: true,
//   },
// ];

const FollowersList: React.FC = () => {
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const dispatch = useAppDispatch();
  const [followers, setFollowers] = useState<Followers[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsersFollowers(
          Number(targetUserId),
          activeTab,
        );
        setFollowers(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab, targetUserId]);

  const handleFollowToggle = async (user: Followers) => {
    if (!user.id) return;

    setFollowers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u,
      ),
    );
    dispatch(
      toggleFollowOptimistic({
        userId: user.id,
        isFollowing: user.isFollowing,
      }),
    );

    try {
      const res = await toggleFollow(user.id);

      // socket.emit("follow_clicked", { targetId: profileData.id });
      toast.success(res.message);
    } catch (error: unknown) {
      dispatch(
        toggleFollowOptimistic({
          userId: user.id,
          isFollowing: !user.isFollowing,
        }),
      );
      setFollowers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u,
        ),
      );
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        toast.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full text-white px-4 font-sans">
      <div className="flex items-center gap-6 p-4 bg-[#1d1d1d]/80 backdrop-blur-md z-10 border-b border-[#333]">
        <ArrowLeftIcon
          className="w-6 mt-2 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold">Follows</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 mb-4 sticky top-0 bg-[#1d1d1d]">
        <button
          onClick={() => setActiveTab("followers")}
          className={`flex-1 cursor-pointer py-5 text-lg text-center font-semibold transition-colors relative ${
            activeTab === "followers" ? "text-white" : "text-gray-500"
          }`}
        >
          Followers
          {activeTab === "followers" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 cursor-pointer py-5 text-lg text-center font-semibold transition-colors relative ${
            activeTab === "following" ? "text-white" : "text-gray-500"
          }`}
        >
          Following
          {activeTab === "following" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-600"></div>
          )}
        </button>
      </div>

      {/* User List */}
      <div className="space-y-9 py-5">
        {followers === null ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : followers.length === 0 ? (
          <div className="text-center text-gray-500">No {activeTab} found.</div>
        ) : (
          followers.map((user) => (
            // <div
            //   key={user.id}
            //   className="flex items-start justify-between group"
            // >
            //   <div className="flex gap-4">
            //     {/* Avatar */}
            //     <img
            //       src={user.photo_profile as string}
            //       alt={user.fullname}
            //       className="w-14 h-14 rounded-full bg-blue-400 object-cover"
            //     />

            //     {/* User Info */}
            //     <div className="flex flex-col">
            //       <div className="flex flex-col">
            //         <span className="font-bold text-lg leading-tight">
            //           {user.fullname}
            //         </span>
            //         <span className="text-gray-500">@{user.username}</span>
            //       </div>
            //       <p className="mt-1 text-gray-300 text-base">{user.bio}</p>
            //     </div>
            //   </div>

            //   {/* Action Button */}
            //   <button
            //     onClick={() => handleFollowToggle(user)}
            //     className={`px-6 py-1.5 rounded-full font-semibold transition-colors ${
            //       user.isFollowing
            //         ? "border border-green-600 text-green-400/60 cursor-pointer hover:bg-green-600/10 hover:text-white"
            //         : "bg-green-600 text-white cursor-pointer hover:bg-green-700"
            //     }`}
            //   >
            //     {user.isFollowing ? "Following" : "Follow"}
            //   </button>
            // </div>
            <UserFollowItem
              key={user.id}
              user={user}
              onFollow={() => handleFollowToggle(user)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FollowersList;
