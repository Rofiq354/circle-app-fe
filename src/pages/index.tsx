import {
  ModalThreadProvider,
  ThreadProvider,
} from "@/context/Threads/ThreadContext";
import Sidebar from "@/layouts/Sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="flex bg-[#1d1d1d] min-h-screen">
      <ModalThreadProvider>
        <Sidebar />

        {/* Content tengah */}
        <main className="flex-1 overflow-y-auto max-h-screen custom-scroll py-8">
          <ThreadProvider>
            <Outlet />
          </ThreadProvider>
        </main>
      </ModalThreadProvider>

      {/* Sidebar kanan (placeholder) */}
      <aside className="w-80 bg-[#141414] text-white p-6">
        <div className="rounded-xl bg-[#1f1f1f] p-4">
          <h2 className="font-bold">My Profile</h2>
        </div>
      </aside>

      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};

export default MainPage;
