import { CircleUser, HomeIcon, SearchIcon, UserIcon } from "lucide-react";

const menu = [
  { name: "Home", icon: HomeIcon },
  { name: "Search", icon: SearchIcon },
  { name: "Follows", icon: UserIcon },
  { name: "Profile", icon: CircleUser },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-[#1d1d1d] text-white flex flex-col px-6 py-8 border-r border-[#333]">
      <div className="text-3xl font-bold text-green-500 px-4 mb-10">circle</div>

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
      </div>

      <div className="mt-auto">
        <button className="w-full py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition">
          Create Post
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
