import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleFollow } from "@/services/follower.service";
import {
  getUsersSuggested,
  type UsersFollow,
} from "@/services/profile.service";
import { toggleFollowOptimistic } from "@/store/profile/profileSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const Profile = ({ onEditClick }: { onEditClick: () => void }) => {
  const { isSidebarVisible } = useAppSelector((state) => state.profile);
  const [userSuggested, setuserSuggested] = useState<UsersFollow[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUsersSuggested(1, 3);
        setuserSuggested(res);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan.",
        );
      }
    };

    fetchData();
  }, [dispatch]);

  const handleFollowToggle = async (user: UsersFollow) => {
    if (!user.id) return;

    const previousSuggestions = [...userSuggested];

    const updatedSuggestions = userSuggested.filter((u) => u.id !== user.id);
    setuserSuggested(updatedSuggestions);

    dispatch(
      toggleFollowOptimistic({
        userId: user.id,
        isFollowing: user.isFollowed,
      }),
    );

    try {
      await toggleFollow(user.id);

      // socket.emit("follow_clicked", { targetId: profileData.id });
    } catch (error: unknown) {
      dispatch(
        toggleFollowOptimistic({
          userId: user.id,
          isFollowing: !user.isFollowed,
        }),
      );
      setuserSuggested(previousSuggestions);
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
    }
  };

  return (
    <aside className="bg-[#141414] h-full w-full text-white p-6  overflow-y-auto custom-scroll">
      {/* MY PROFILE CARD */}
      {isSidebarVisible && <CardProfile onEditClick={onEditClick} />}

      {/* SUGGESTED FOR YOU */}
      <div className="overflow-hidden">
        <AnimatePresence>
          {userSuggested.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.5 }} // Delay sedikit agar list user selesai animasi dulu
              className="mt-4 rounded-2xl bg-[#1f1f1f] p-5 border border-[#333] overflow-hidden"
            >
              <h2 className="font-medium mb-4 text-xl">Suggested for you</h2>

              <AnimatePresence mode="popLayout">
                {userSuggested.map((u) => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <SuggestedForYou
                      user={u}
                      onFollow={() => handleFollowToggle(u)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {/* FOOTER */}
          <motion.div
            layout
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileFooter />
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
};

const CardProfile = ({ onEditClick }: { onEditClick: () => void }) => {
  const { myProfile, isMyProfileLoading } = useAppSelector(
    (state) => state.profile,
  );
  const [isError, setIsError] = useState(false);

  if (isMyProfileLoading && !myProfile) {
    return (
      <div className="rounded-2xl bg-[#1f1f1f] border border-[#333] p-10 text-center text-gray-500">
        Loading Profile...
      </div>
    );
  }

  if (!myProfile) return null;

  const profile = myProfile;

  const imageIcon = (
    <div className="w-full h-full rounded-full bg-[#333] z-0 flex items-center justify-center border">
      <User size={20} className="text-[#777]" />
    </div>
  );

  return (
    <div className="rounded-2xl bg-[#1f1f1f] border border-[#333] shadow-xl overflow-hidden">
      <h2 className="px-5 py-3 font-medium text-xl">My Profile</h2>

      {/* Banner Section */}
      <div className="relative mb-12 px-5">
        {profile.cover_photo ? (
          <img
            src={profile.cover_photo}
            className="h-24 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="h-24 w-full rounded-xl bg-linear-to-r from-[#53906a] via-[#e2e88a] to-[#f4b678]"></div>
        )}

        {/* Avatar Profile */}
        <div className="absolute -bottom-10 left-10">
          <div className="w-20 h-20 rounded-full border-[5px] border-[#1f1f1f] overflow-hidden shadow-lg">
            {profile.photo_profile && !isError ? (
              <img
                src={profile.photo_profile as string}
                alt="profile"
                className="w-full h-full bg-blue-400 object-cover"
                onError={() => setIsError(true)}
              />
            ) : (
              imageIcon
            )}
          </div>
        </div>

        {/* Button Edit Profile */}
        <div className="absolute -bottom-12 right-5">
          <button
            onClick={onEditClick}
            className="border border-green-600 text-green-600 cursor-pointer hover:bg-green-600 hover:text-white text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-6 pt-2 pb-5">
        {" "}
        <div className="mt-2">
          <Link to={`/profile/${profile.username}`}>
            <h2 className="text-2xl font-bold flex items-center gap-1">
              ✨ {profile.name} ✨
            </h2>
          </Link>
          <p className="text-[#777] my-1">@{profile.username}</p>

          <p className="text-white text-lg leading-snug">{profile.bio}</p>

          <div className="flex gap-4 mt-3">
            <div className="flex gap-1 items-center">
              <p className="font-bold text-white">{profile.following_count}</p>
              <p className="text-[#777]">Following</p>
            </div>
            <div className="flex gap-1 items-center">
              <p className="font-bold text-white">{profile.follower_count}</p>
              <p className="text-[#777]">Followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileFooter = () => {
  return (
    <footer className="mt-4 rounded-xl bg-[#1f1f1f] p-4 border border-[#333]">
      <div className="flex flex-col gap-2">
        {/* Developed by & Social Icons */}
        <div className="flex items-center gap-2">
          <p className="text-white text-lg">
            Developed by <span className="font-bold">Ainur Rofiq</span>
          </p>

          <span className="text-[#777]">•</span>

          <div className="flex items-center gap-3 ml-1">
            {/* Github */}
            <a
              href="#"
              className="text-[#777] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              className="text-[#777] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="text-[#777] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="text-[#777] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Powered by DumbWays */}
        <div className="flex items-center gap-1 text-[#777]">
          <span>Powered by</span>
          <div className="flex items-center gap-1.5 ml-1 text-sm">
            {/* Logo DW */}
            <img src="/public/Red.png" alt="" />
            <span className="text-[#999] font-medium">DumbWays Indonesia</span>
          </div>
          <span className="text-2xl mb-1">•</span>
          <span className="italic">#1 Coding Bootcamp</span>
        </div>
      </div>
    </footer>
  );
};

interface Props {
  user: UsersFollow;
  onFollow: () => void;
}

const SuggestedForYou: React.FC<Props> = ({ user, onFollow }) => {
  const [isError, setIsError] = useState(false);
  const imageIcon = (
    <div className="w-full h-full rounded-full bg-[#333] z-0 flex items-center justify-center border border-[#444]">
      <User size={20} className="text-[#777]" />
    </div>
  );
  return (
    <div className="flex items-center justify-between mb-4 last:mb-0">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
          {user?.photo_profile && !isError ? (
            <img
              src={user?.photo_profile as string}
              alt="avatar"
              className="w-full h-full bg-blue-400 object-cover"
              onError={() => setIsError(true)}
            />
          ) : (
            imageIcon
          )}
        </div>
        <div>
          <Link to={`/profile/${user.username}`}>
            <p className="font-medium text-lg truncate w-52 hover:underline">
              {user.fullname}
            </p>
          </Link>
          <p className="text-[#777]">@{user.username}</p>
        </div>
      </div>
      <button
        onClick={onFollow}
        className={`text-sm font-bold px-4 py-1.5 rounded-full transition ${
          user.isFollowed
            ? "border border-green-600 text-green-400/60 cursor-pointer transition-colors hover:bg-green-600/50 hover:text-white"
            : "bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors"
        }`}
      >
        {user.isFollowed ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default Profile;
