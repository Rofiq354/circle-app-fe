import { ModalThreadProvider } from "@/context/Threads/ThreadContext";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useModalThread } from "@/hooks/useThread";
import { authLogout } from "@/store/auth/authThunk";
import {
  CircleUser,
  HomeIcon,
  LogOutIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menu = [
  { name: "Home", icon: HomeIcon },
  { name: "Search", icon: SearchIcon },
  { name: "Follows", icon: UserIcon },
  { name: "Profile", icon: CircleUser },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    setTimeout(() => {
      dispatch(authLogout()); // clear redux state
      navigate("/auth/login");
    }, 1000);
  };
  return (
    <aside className="min-w-64 w-80 h-screen overflow-y-hidden bg-[#1d1d1d] text-white flex flex-col px-6 py-8 border-r border-[#333]">
      <div className="text-5xl font-bold text-green-500 px-4 mb-10">circle</div>

      <div className="flex flex-col gap-4">
        {menu.map((item) => (
          <button
            key={item.name}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-white/10 transition"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
        <ModalThreadProvider>
          <ButtonCreateThread />
        </ModalThreadProvider>
      </div>

      {/* Section Akun (Profile + Logout) */}
      <div className="mt-auto flex flex-col gap-2">
        
        {/* Profile Info Ringkas */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2 2xl:hidden border-t border-[#333] pt-5">
          <img 
            src="https://i.pravatar.cc/150?img=32" 
            className="w-9 h-9 rounded-full object-cover border border-[#444]" 
            alt="profile"
          />
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold truncate">Indah Pra Karya</p>
            <p className="text-xs text-[#777] truncate">@indahpra</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-[#bdbdbd]"
        >
          <LogOutIcon className="w-5 h-5 -scale-x-100" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const ButtonCreateThread = () => {
   const { openModal } = useModalThread();
  return (
    <button
      onClick={openModal}
      className="w-full py-3 cursor-pointer rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition"
    >
      Create Post
    </button>
  );
}

export default Sidebar;
