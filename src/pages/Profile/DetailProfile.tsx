import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleFollow } from "@/services/follower.service";
import {
  hideSidebar,
  openEditModal,
  setProfile,
  showSidebar,
  toggleFollowOptimistic,
} from "@/store/profile/profileSlice";
import { fetchProfile } from "@/store/profile/profileThunk";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const DetailProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authUser = useAppSelector((state) => state.auth.user);
  const {
    viewedProfile: profileData,
    myProfile,
    isViewedProfileLoading,
  } = useAppSelector((state) => state.profile);

  // const isMyProfileEmpty = myProfile === null;

  useEffect(() => {
    if (!username) return;

    const isAccessingSelf = username === authUser?.username;

    if (isAccessingSelf) {
      dispatch(hideSidebar());

      if (myProfile) {
        dispatch(setProfile(myProfile));
      } else {
        dispatch(fetchProfile(username));
      }
    } else {
      dispatch(showSidebar());
      dispatch(fetchProfile(username));
    }

    return () => {
      dispatch(showSidebar());
    };
  }, [username, authUser?.username, myProfile, dispatch]);

  const isMyProfile = profileData?.username === authUser?.username;

  const handleFollowToggle = async () => {
    if (profileData && !isMyProfile) {
      dispatch(toggleFollowOptimistic());

      try {
        await toggleFollow(profileData.id);

        // Jika pakai socket, kirim trigger di sini
        // socket.emit("follow_clicked", { targetId: profileData.id });
      } catch (error: unknown) {
        dispatch(toggleFollowOptimistic());
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan.",
        );
      }
    }
  };

  if (isViewedProfileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="bg-[#1d1d1d] min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-6 px-4 py-4 sticky top-0 bg-[#1d1d1d]/80 backdrop-blur-md z-10 border-b border-[#333]">
        <ArrowLeftIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div>
          <h1 className="text-xl font-bold">
            {profileData?.name || "Profile"}
          </h1>
          <p className="text-xs text-gray-500">
            {profileData?.threads_count || 0} Posts
          </p>
        </div>
      </div>

      {/* Banner */}
      <div className="relative">
        <div className="h-48 w-full bg-[#333] overflow-hidden">
          {profileData?.cover_photo ? (
            <img
              src={profileData.cover_photo}
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
              src={profileData?.photo_profile as string}
              className="w-full h-full object-cover"
              alt="avatar"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end p-4">
        {isMyProfile ? (
          <button
            onClick={() => dispatch(openEditModal())}
            className="border cursor-pointer border-white rounded-full px-6 py-1.5 font-bold hover:bg-white/10 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleFollowToggle}
            className={`rounded-full cursor-pointer px-6 py-1.5 font-bold transition ${
              profileData?.isFollowed
                ? "border border-green-700 text-green-700 hover:bg-green-500/10 hover:border-green-500 hover:text-green-500"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {profileData?.isFollowed ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Detail Info */}
      <div className="px-4 mt-8 space-y-2">
        <div>
          <h2 className="text-3xl font-bold">{profileData?.name}</h2>
          <p className="text-gray-400 text-lg">@{profileData?.username}</p>
        </div>
        <p className="text-white text-xl leading-relaxed">{profileData?.bio}</p>

        <div className="flex text-lg gap-6 pt-2">
          <p>
            <span className="font-bold">
              {profileData?.following_count || 0}
            </span>{" "}
            <span className="text-gray-400">Following</span>
          </p>
          <p>
            <span className="font-bold">
              {profileData?.follower_count || 0}
            </span>{" "}
            <span className="text-gray-400">Followers</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#333] mt-6 sticky top-14 bg-[#1d1d1d] z-10">
        <button className="flex-1 py-4 font-bold border-b-4 border-green-500">
          All Post
        </button>
        <button className="flex-1 py-4 font-bold text-gray-400 hover:bg-white/5 transition">
          Media
        </button>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="bg-[#1d1d1d] min-h-screen text-white animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6 px-4 py-3 border-b border-[#333]">
        <div className="w-5 h-5 bg-[#333] rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#333] rounded"></div>
          <div className="h-3 w-16 bg-[#333] rounded"></div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="h-48 w-full bg-[#222]"></div>

      {/* Avatar Skeleton */}
      <div className="relative px-4">
        <div className="absolute -top-16 left-4">
          <div className="w-32 h-32 rounded-full border-4 border-[#1d1d1d] bg-[#333]"></div>
        </div>

        {/* Action Button Skeleton */}
        <div className="flex justify-end pt-4">
          <div className="w-28 h-9 bg-[#333] rounded-full"></div>
        </div>
      </div>

      {/* Info Profil Skeleton */}
      <div className="px-4 mt-8 space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#333] rounded"></div>
          <div className="h-4 w-32 bg-[#333] rounded"></div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-[#333] rounded"></div>
          <div className="h-4 w-3/4 bg-[#333] rounded"></div>
        </div>
        <div className="flex gap-6 pt-4">
          <div className="h-4 w-24 bg-[#333] rounded"></div>
          <div className="h-4 w-24 bg-[#333] rounded"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex border-b border-[#333] mt-8">
        <div className="flex-1 py-4 flex justify-center">
          <div className="h-4 w-20 bg-[#333] rounded"></div>
        </div>
        <div className="flex-1 py-4 flex justify-center">
          <div className="h-4 w-20 bg-[#333] rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailProfilePage;
