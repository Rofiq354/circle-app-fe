import { ThreadProvider } from "@/context/Threads/ThreadContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import Profile from "@/layouts/Profile";
import Sidebar from "@/layouts/Sidebar";
import { updateProfile } from "@/store/profile/profileThunk";
import toast, { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import { closeEditModal, openEditModal } from "@/store/profile/profileSlice";
import ThreadDialog from "@/components/Threads/ThreadDialog";
import { closeModal, openModal } from "@/store/like/threadSlice";
import { HomeIcon, PlusCircleIcon, UserIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

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
  const navigate = useNavigate();
  const userImage = useSelector(
    (state: RootState) => state.profile.myProfile?.photo_profile,
  );

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#1d1d1d] border-t border-[#333] px-6 py-3 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="p-2 cursor-pointer text-white"
        >
          <HomeIcon className="w-7 h-7" />
        </button>
        <button className="p-2 text-white cursor-pointer">
          <MagnifyingGlassIcon className="w-7 h-7" />
        </button>
        {/* Tombol Tengah (Create) biasanya dibuat lebih menonjol */}
        <button
          onClick={() => dispatch(openModal())}
          className="p-2 text-green-500 cursor-pointer"
        >
          <PlusCircleIcon className="w-8 h-8" />
        </button>
        <button className="p-2 text-white cursor-pointer">
          <UserIcon className="w-7 h-7" />
        </button>
        <button className="p-2 text-white cursor-pointer">
          <img
            src={userImage as string}
            className="w-7 h-7 rounded-full border border-[#444]"
            alt="profile"
          />
        </button>
      </div>
    </nav>
  );
};

export default MainPage;
