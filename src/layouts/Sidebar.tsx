import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { authLogout } from "@/store/auth/authThunk";
import { openModal } from "@/store/like/threadSlice";
import { motion } from "framer-motion";
import {
  CircleUser,
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  User,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const { myProfile } = useSelector((state: RootState) => state.profile);

  const imageIcon = (
    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
      <User size={20} className="text-[#777]" />
    </div>
  );

  const menu = [
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Search", icon: SearchIcon, path: "/search" },
    {
      name: "Follows",
      icon: UserIcon,
      path: `/profile/${myProfile?.id}/followers`,
    },
    {
      name: "Profile",
      icon: CircleUser,
      path: `/profile/${myProfile?.username}`,
    },
  ];
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
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-3 px-4 py-3 cursor-pointer rounded-lg transition 
              ${
                isActive
                  ? "bg-white/15 text-green-500"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-green-500 rounded-r-full lg:block hidden"
                  />
                )}
                <item.icon
                  className={`w-6 h-6 lg:w-5 lg:h-5 ${isActive ? "text-green-500" : ""}`}
                />
                <span
                  className={`hidden lg:block text-sm ${isActive ? "font-bold" : "font-medium"}`}
                >
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <ButtonCreateThread />
      </div>

      {/* Section Akun (Profile + Logout) */}
      <div className="mt-auto flex flex-col gap-2">
        {/* Section Akun */}
        <div className="flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 mb-2 2xl:hidden border-t border-[#333] pt-5 overflow-hidden">
          <div className="relative cursor-pointer">
            {myProfile?.photo_profile && !isError ? (
              <img
                src={myProfile?.photo_profile as string}
                alt="profile"
                className="w-10 h-10 lg:w-9 lg:h-9 aspect-square min-w-10 lg:min-w-9 rounded-full object-cover border border-[#444] shrink-0"
                onError={() => setIsError(true)}
              />
            ) : (
              imageIcon
            )}
          </div>

          <div className="hidden lg:flex flex-col min-w-0 overflow-hidden">
            <Link to={`/profile/${myProfile?.username}`}>
              <p className="text-sm font-bold truncate hover:underline">
                {myProfile?.name}
              </p>
            </Link>
            <p className="text-xs text-[#777] truncate">
              @{myProfile?.username}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer justify-center lg:justify-start gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-[#bdbdbd]"
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
      <PlusIcon className="w-6 h-6 lg:hidden" />

      <span className="hidden lg:block">Create Post</span>
    </button>
  );
};

export default Sidebar;
