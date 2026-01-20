import Sidebar from "@/layouts/Sidebar";
import { Outlet } from "react-router-dom";

const ThreadsPage = () => {
  return (
    <div className="flex bg-[#1d1d1d] min-h-screen">
      <Sidebar />

      {/* Content tengah */}
      <main className="flex-1 overflow-y-auto max-h-screen custom-scroll py-8">
        <Outlet />
      </main>

      {/* Sidebar kanan (placeholder) */}
      <aside className="w-80 bg-[#141414] text-white p-6">
        <div className="rounded-xl bg-[#1f1f1f] p-4">
          <h2 className="font-bold">My Profile</h2>
        </div>
      </aside>
    </div>
  );
};

export default ThreadsPage;
