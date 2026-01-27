import AnimatedCounter from "@/components/Profile/CounterFollow";
import ProfileSkeleton from "@/components/Profile/ProfileSkeleton";
import UserNotFound from "@/components/Profile/UserNotFound";
import { ThreadItem } from "@/components/Threads/ThreadItem";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleFollow } from "@/services/follower.service";
import {
  getUsersByUsername,
  type UsersFollow,
} from "@/services/profile.service";
import { getThreadByUserId } from "@/services/thread.service";
import {
  hideSidebar,
  openEditModal,
  showSidebar,
  toggleFollowOptimistic,
} from "@/store/profile/profileSlice";
import type { Thread } from "@/types/threads";
import axios from "axios";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda 0.1 detik antar item
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const DetailProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  // const threads = useSelector(selectAllThreads);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isFollowProcessing, setIsFollowProcessing] = useState(false);
  const [profileData, setProfileData] = useState<UsersFollow | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state) => state.auth.user);

  const isMyProfile = profileData?.username === authUser?.username;

  useEffect(() => {
    if (!username) return;

    if (isMyProfile) {
      dispatch(hideSidebar());
    } else {
      dispatch(showSidebar());
    }

    return () => {
      dispatch(showSidebar());
    };
  }, [username, isMyProfile, dispatch]);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!profileData?.id) return;
      try {
        const res = await getThreadByUserId(Number(profileData?.id));
        setThreads(res);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          toast.error(error.response?.data.message);
        }
      }
    };

    fetchThreads();
  }, [profileData?.id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUsersByUsername(username as string);
        setProfileData(res);
        // console.log(res);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, [username]);

  const filteredThreads = useMemo(() => {
    if (activeTab === "media") {
      return threads.filter((thread) => thread.image);
    }
    return threads;
  }, [activeTab, threads]);

  const handleFollowToggle = async () => {
    // setProfileData(profileData?.id ? profileData.isFollowed : !profileData?.isFollowed)
    if (!profileData || isMyProfile || isFollowProcessing) return;

    setIsFollowProcessing(true);
    const previousData = { ...profileData };

    setProfileData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isFollowed: !prev.isFollowed,
        follower_count: prev.isFollowed
          ? prev.follower_count - 1
          : prev.follower_count + 1,
      };
    });

    dispatch(
      toggleFollowOptimistic({
        userId: profileData.id,
        isFollowing: previousData.isFollowed,
      }),
    );

    try {
      await toggleFollow(profileData.id);

      // Jika pakai socket, kirim trigger di sini
      // socket.emit("follow_clicked", { targetId: profileData.id });
    } catch (error: unknown) {
      setProfileData(previousData);
      dispatch(
        toggleFollowOptimistic({
          userId: profileData.id,
          isFollowing: !previousData.isFollowed,
        }),
      );
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Gagal melakukan aksi");
      }
    } finally {
      setIsFollowProcessing(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!loading && !profileData) {
    return <UserNotFound />;
  }

  return (
    <div className="bg-[#1d1d1d] min-h-screen text-white">
      <ProfileHeader
        fullname={profileData?.fullname}
        threadsCount={profileData?.threads_count}
      />

      <ProfileBanner
        coverPhoto={profileData?.cover_photo as string}
        photoProfile={profileData?.photo_profile as string}
      />

      <ProfileActions
        isMyProfile={isMyProfile}
        isFollowed={profileData?.isFollowed}
        isProcessing={isFollowProcessing}
        onFollowToggle={handleFollowToggle}
        onEditClick={() => dispatch(openEditModal())}
      />

      <ProfileInfo
        id={profileData?.id}
        fullname={profileData?.fullname}
        username={profileData?.username}
        bio={profileData?.bio}
        followerCount={profileData?.follower_count || 0}
        followingCount={profileData?.following_count || 0}
      />

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <motion.div
        key={activeTab}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 mt-6"
      >
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            // List Threads
            <motion.div key={thread.id} variants={itemVariants}>
              <ThreadItem {...thread} />
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-500 italic">
            Belum ada postingan {activeTab === "media" ? "media" : ""}
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* Header ========================================================================== */

interface ProfileHeaderProps {
  fullname?: string;
  threadsCount?: number;
}

const ProfileHeader = ({ fullname, threadsCount }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-6 px-4 py-4 sticky top-0 bg-[#1d1d1d]/80 backdrop-blur-md z-10 border-b border-[#333]">
      <ArrowLeft
        className="w-5 h-5 cursor-pointer text-white"
        onClick={() => navigate(-1)}
      />
      <div>
        <h1 className="text-xl font-bold text-white">
          {fullname || "Profile"}
        </h1>
        <p className="text-xs text-gray-500">{threadsCount || 0} Posts</p>
      </div>
    </div>
  );
};

/* Banner ========================================================================== */

interface ProfileBannerProps {
  coverPhoto?: string;
  photoProfile?: string;
}

const ProfileBanner = ({ coverPhoto, photoProfile }: ProfileBannerProps) => {
  return (
    <div className="relative">
      <div className="h-48 w-full bg-[#333] overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            className="w-full h-full object-cover"
            alt="banner"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-green-600/20 to-yellow-600/20" />
        )}
      </div>

      {/* Avatar */}
      <div className="absolute -bottom-16 left-4">
        <div className="w-32 h-32 rounded-full border-4 border-[#1d1d1d] overflow-hidden bg-[#222]">
          <img
            src={photoProfile || "/default-avatar.png"}
            className="w-full h-full object-cover"
            alt="avatar"
          />
        </div>
      </div>
    </div>
  );
};

/* Actions ========================================================================== */

interface ProfileActionsProps {
  isMyProfile: boolean;
  isFollowed?: boolean;
  isProcessing: boolean;
  onFollowToggle: () => void;
  onEditClick: () => void;
}

const ProfileActions = ({
  isMyProfile,
  isFollowed,
  isProcessing,
  onFollowToggle,
  onEditClick,
}: ProfileActionsProps) => {
  return (
    <div className="flex justify-end p-4">
      {isMyProfile ? (
        <button
          onClick={onEditClick}
          className="border cursor-pointer border-white text-white rounded-full px-6 py-1.5 font-bold hover:bg-white/10 transition"
        >
          Edit Profile
        </button>
      ) : (
        <button
          onClick={onFollowToggle}
          disabled={isProcessing}
          className={`relative overflow-hidden rounded-full px-6 py-1.5 font-bold transition-all duration-300 min-w-30 ${
            isFollowed
              ? "border border-green-700 text-green-700 hover:bg-green-500/10"
              : "bg-green-600 text-white hover:bg-green-700"
          } ${isProcessing ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isFollowed ? "unfollow" : "follow"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="block text-center w-full"
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </div>
  );
};

/* Info ========================================================================== */

interface ProfileInfoProps {
  id?: number;
  fullname?: string;
  username?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
}

export const ProfileInfo = ({
  id,
  fullname,
  username,
  bio,
  followerCount,
  followingCount,
}: ProfileInfoProps) => {
  return (
    <div className="px-4 mt-8 space-y-2">
      <div>
        <h2 className="text-3xl font-bold text-white">{fullname}</h2>
        <p className="text-gray-400 text-lg">@{username}</p>
      </div>
      <p className="text-white text-xl leading-relaxed">{bio}</p>

      <div className="flex text-lg gap-6 pt-2">
        <Link
          to={`/profile/${id}/following`}
          className="hover:underline text-white"
        >
          <AnimatedCounter value={followingCount} />
          <span className="text-gray-400 ml-1">Following</span>
        </Link>

        <Link
          to={`/profile/${id}/followers`}
          className="hover:underline text-white"
        >
          <AnimatedCounter value={followerCount} />
          <span className="text-gray-400 ml-1">Followers</span>
        </Link>
      </div>
    </div>
  );
};

/* Tabs ========================================================================== */

type TabType = "all" | "media";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabs = [
    { id: "all", label: "All Post" },
    { id: "media", label: "Media" },
  ];

  return (
    <div className="flex border-b border-[#333] mt-6 bg-[#1d1d1d] z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as TabType)}
          className={`flex-1 py-4 font-bold cursor-pointer relative transition-colors duration-300 ${
            activeTab === tab.id
              ? "text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tab.label}

          {/* Animasi Garis Bawah */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default DetailProfilePage;
