import { ThreadProvider } from "@/context/Threads/ThreadContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import Profile from "@/layouts/Profile";
import Sidebar from "@/layouts/Sidebar";
import { updateProfile } from "@/store/profile/profileThunk";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, Outlet } from "react-router-dom";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import { closeEditModal, openEditModal } from "@/store/profile/profileSlice";
import ThreadDialog from "@/components/Threads/ThreadDialog";
import { closeModal, openModal } from "@/store/like/threadSlice";
import { HomeIcon, PlusCircleIcon, User, UserIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const MainPage = () => {
  const { myProfile, isEditModalOpen } = useAppSelector(
    (state) => state.profile,
  );
  const { isModalOpen: isThreadModalOpen } = useAppSelector(
    (state) => state.threads,
  );
  const dispatch = useAppDispatch();

  const handleSaveProfile = async (formData: FormData) => {
    try {
      const res = await dispatch(updateProfile(formData)).unwrap();
      dispatch(closeEditModal());
      toast.success(res.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1d1d1d] overflow-hidden">
      <div className="hidden sm:block shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 h-full overflow-y-auto custom-scroll border-r border-[#333] bg-[#1d1d1d] pb-16 lg:pb-0">
        <div className="w-full md:w-[95%] 2xl:w-full max-w-300 mx-auto py-5 px-4 md:px-8 sm:px-10">
          <ThreadProvider>
            <Outlet />
          </ThreadProvider>
        </div>
      </main>

      <div className="hidden 2xl:block w-137.5 shrink-0">
        <Profile onEditClick={() => dispatch(openEditModal())} />
      </div>

      <Toaster position="top-center" reverseOrder={true} />

      <ThreadDialog
        isOpen={isThreadModalOpen}
        onClose={() => dispatch(closeModal())}
      />

      <EditProfileModal
        key={isEditModalOpen ? "open" : "closed"}
        isOpen={isEditModalOpen}
        onClose={() => dispatch(closeEditModal())}
        initialData={myProfile}
        onSave={handleSaveProfile}
      />

      <BottomNav />
    </div>
  );
};

const BottomNav = () => {
  const dispatch = useAppDispatch();
  const myProfile = useAppSelector((state) => state.profile.myProfile);
  const userImage = myProfile?.photo_profile;
  const [isImageError, setIsImageError] = useState(false);

  // Helper untuk styling active
  const activeClass = "text-green-500 scale-110";
  const inactiveClass = "text-white opacity-70 hover:opacity-100";

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#1d1d1d]/90 backdrop-blur-md border-t border-[#333] px-6 py-3 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-2 transition-all ${isActive ? activeClass : inactiveClass}`
          }
        >
          <HomeIcon className="w-7 h-7" />
        </NavLink>

        {/* Search */}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `p-2 transition-all ${isActive ? activeClass : inactiveClass}`
          }
        >
          <MagnifyingGlassIcon className="w-7 h-7" />
        </NavLink>

        {/* Tombol Tengah (Create) */}
        <button
          onClick={() => dispatch(openModal())}
          className="p-2 text-green-500 cursor-pointer active:scale-90 transition-transform"
        >
          <PlusCircleIcon className="w-10 h-10" />
        </button>

        {/* Follows/User List */}
        <NavLink
          to={`/profile/${myProfile?.id}/followers`}
          className={({ isActive }) =>
            `p-2 transition-all ${isActive ? activeClass : inactiveClass}`
          }
        >
          <UserIcon className="w-7 h-7" />
        </NavLink>

        {/* Profile Avatar */}
        <NavLink
          to={`/profile/${myProfile?.username}`}
          className={({ isActive }) =>
            `p-1 rounded-full border-2 transition-all ${
              isActive
                ? "border-green-500 scale-110"
                : "border-transparent opacity-70"
            }`
          }
        >
          {userImage && !isImageError ? (
            <img
              src={userImage as string}
              className="w-7 h-7 rounded-full object-cover"
              alt="profile"
              onError={() => setIsImageError(true)}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#333] flex items-center justify-center border border-[#c0c0c0]">
              <User size={14} className="text-[#c0c0c0]" />
            </div>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default MainPage;
