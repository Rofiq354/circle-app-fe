import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authLogout } from "@/store/auth/authThunk";
import { openModal } from "@/store/like/threadSlice";
import {
  CircleUser,
  HomeIcon,
  LogOutIcon,
  PlusIcon,
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
    <aside className="w-20 lg:w-80 h-screen overflow-y-hidden bg-[#1d1d1d] text-white flex flex-col px-4 lg:px-6 py-8 border-r border-[#333] transition-all duration-300">
      <div className="text-3xl lg:text-5xl font-bold text-green-500 px-2 lg:px-4 mb-10 text-center lg:text-left">
        <span className="lg:hidden">C</span>
        <span className="hidden lg:block">circle</span>
      </div>

      <div className="flex flex-col gap-4">
        {menu.map((item) => (
          <button
            key={item.name}
            className="flex items-center justify-center lg:justify-start gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-white/10 transition"
          >
            <item.icon className="w-6 h-6 lg:w-5 lg:h-5" />
            {/* 3. Sembunyikan teks di layar kecil */}
            <span className="hidden lg:block text-sm font-medium">
              {item.name}
            </span>
          </button>
        ))}
        <ButtonCreateThread />
      </div>

      {/* Section Akun (Profile + Logout) */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Section Akun Ringkas */}
        <div className="flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 mb-2 2xl:hidden border-t border-[#333] pt-5 overflow-hidden">
          <img
            src="https://i.pravatar.cc/150?img=32"
            className="w-10 h-10 lg:w-9 lg:h-9 aspect-square min-w-10 lg:min-w-9 rounded-full object-cover border border-[#444] shrink-0"
            alt="profile"
          />

          {/* Gunakan min-w-0 pada container teks agar truncate bekerja tanpa merusak layout */}
          <div className="hidden lg:flex flex-col min-w-0 overflow-hidden">
            <p className="text-sm font-bold truncate">Indah Pra Karya</p>
            <p className="text-xs text-[#777] truncate">@indahpra</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-[#bdbdbd]"
        >
          <LogOutIcon className="w-6 h-6 lg:w-5 lg:h-5 -scale-x-100" />
          <span className="hidden lg:block text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const ButtonCreateThread = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => dispatch(openModal())}
      className="w-full flex items-center justify-center py-3 cursor-pointer rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition"
    >
      {/* 1. Ikon Plus: Hanya muncul di layar kecil (Mobile/Tablet) */}
      <PlusIcon className="w-6 h-6 lg:hidden" />

      {/* 2. Teks: Hanya muncul di layar besar (Desktop) */}
      <span className="hidden lg:block">Create Post</span>
    </button>
  );
};

export default Sidebar;
