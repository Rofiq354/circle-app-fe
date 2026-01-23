import { ThreadProvider } from "@/context/Threads/ThreadContext";
import Sidebar from "@/layouts/Sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] 2xl:grid-cols-[auto_1fr_450px] h-screen w-full bg-[#1d1d1d] overflow-hidden">
      <Sidebar />

      <main className="h-full overflow-y-auto custom-scroll border-r border-[#333] bg-[#1d1d1d] translate-y-3.5">
        <div className="w-[95%] md:w-[90%] lg:w-[85%] 2xl:w-full max-w-[50rem] mx-auto">
          <ThreadProvider>
            <Outlet />
          </ThreadProvider>
        </div>
      </main>

      {/* 3. Sidebar Kanan (Lebih Lebar - 400px) */}
      <aside className="bg-[#141414] text-white p-6 hidden 2xl:block overflow-y-auto custom-scroll">
        {/* Profile Card yang lebih lega */}
        <div className="rounded-2xl bg-[#1f1f1f] p-6 border border-[#333] shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-linear-to-tr from-yellow-400 to-orange-500 p-1 mb-4">
              <img
                src="https://i.pravatar.cc/150?img=32"
                className="w-full h-full rounded-full object-cover border-4 border-[#1f1f1f]"
                alt="profile"
              />
            </div>
            <h2 className="text-xl font-bold">Indah Pra Karya</h2>
            <p className="text-[#777] text-sm">@indahpra</p>

            <p className="text-center text-gray-300 mt-4 text-sm leading-relaxed">
              Software Engineer & Tech Enthusiast. Suka berbagi cerita tentang
              finansial dan coding.
            </p>

            <div className="flex gap-6 mt-6 w-full border-t border-[#333] pt-4 justify-around">
              <div className="text-center">
                <p className="font-bold text-white">1.2k</p>
                <p className="text-xs text-[#777]">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">450</p>
                <p className="text-xs text-[#777]">Following</p>
              </div>
            </div>

            <button className="w-full mt-6 bg-white text-black font-bold py-2 rounded-full hover:bg-gray-200 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Section Tambahan di bawah profile */}
        <div className="mt-6 rounded-2xl bg-[#1f1f1f] p-5 border border-[#333]">
          <h2 className="font-bold mb-4 text-lg">Who to follow</h2>
          {/* List item dummy */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between mb-4 last:mb-0"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600" />
                <div>
                  <p className="text-sm font-bold">User {i}</p>
                  <p className="text-xs text-[#777]">@user_{i}</p>
                </div>
              </div>
              <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full">
                Follow
              </button>
            </div>
          ))}
        </div>
      </aside>

      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};

export default MainPage;
