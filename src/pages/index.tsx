import { ThreadProvider } from "@/context/Threads/ThreadContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import Profile from "@/layouts/Profile";
import Sidebar from "@/layouts/Sidebar";
import { updateProfile } from "@/store/profile/profileThunk";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import { closeEditModal, openEditModal } from "@/store/profile/profileSlice";
import ThreadDialog from "@/components/Threads/ThreadDialog";
import { closeModal } from "@/store/like/threadSlice";

const MainPage = () => {
  const { data: profile, isEditModalOpen } = useAppSelector(
    (state) => state.profile,
  );
  const { isModalOpen: isThreadModalOpen } = useAppSelector(
    (state) => state.threads,
  );
  const dispatch = useAppDispatch();

  const handleSaveProfile = async (formData: FormData) => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      dispatch(closeEditModal());
      // Optional: Munculkan toast sukses
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="grid grid-cols-[auto_1fr] 2xl:grid-cols-[auto_1fr_520px] h-screen w-full bg-[#1d1d1d] overflow-hidden">
      <Sidebar />

      <main className="h-full overflow-y-auto custom-scroll border-r border-[#333] bg-[#1d1d1d] translate-y-3.5">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-full max-w-200 mx-auto">
          <ThreadProvider>
            <Outlet />
          </ThreadProvider>
        </div>
      </main>

      <Profile onEditClick={() => dispatch(openEditModal())} />

      <Toaster position="top-center" reverseOrder={true} />

      <ThreadDialog
        isOpen={isThreadModalOpen}
        onClose={() => dispatch(closeModal())}
      />

      <EditProfileModal
        key={isEditModalOpen ? "open" : "closed"}
        isOpen={isEditModalOpen}
        onClose={() => dispatch(closeEditModal())}
        initialData={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default MainPage;
