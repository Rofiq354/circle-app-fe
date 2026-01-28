import UserFollowItem from "@/components/Users/UserFollowItem";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useDebounce } from "@/hooks/useDebounce";
import { toggleFollow, type Followers } from "@/services/follower.service";
import { getUsersBySearch, type UsersFollow } from "@/services/profile.service";
import { toggleFollowOptimistic } from "@/store/profile/profileSlice";
import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SearchUsers = ({ placeholder = "Search your friends" }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UsersFollow[] | Followers[]>([]);
  const dispatch = useAppDispatch();

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getUsersBySearch(debouncedSearch);
        setUsers(response);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const handleFollowToggle = async (targetUser: Followers) => {
    if (!targetUser.id) return;

    const previousState = [...users];

    setUsers((prev) =>
      (prev as Followers[]).map((u) =>
        u.id === targetUser.id ? { ...u, isFollowing: !u.isFollowing } : u,
      ),
    );
    dispatch(
      toggleFollowOptimistic({
        userId: targetUser.id,
        isFollowing: targetUser.isFollowing,
      }),
    );

    try {
      const res = await toggleFollow(targetUser.id);

      // socket.emit("follow_clicked", { targetId: profileData.id });
      toast.success(res.message);
    } catch (error: unknown) {
      dispatch(
        toggleFollowOptimistic({
          userId: targetUser.id,
          isFollowing: !targetUser.isFollowing,
        }),
      );
      setUsers((prev) =>
        (prev as Followers[]).map((u) =>
          u.id === targetUser.id ? { ...u, isFollowing: !u.isFollowing } : u,
        ),
      );
      setUsers(previousState as Followers[]);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen text-white px-4 pb-4 font-sans">
      {/* Search Bar */}
      <div className="pb-4 pt-8 sticky top-0 px-2 bg-[#1d1d1d] mb-6 z-99">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery as string}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#202327] text-lg border-none rounded-full py-3 pl-12 pr-6 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col min-h-[70vh] px-3">
        {isLoading ? (
          // Tampilkan 3 item skeleton saat loading
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SearchUserSkeleton key={i} />
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          // Tampilkan data asli jika tidak loading
          <div className="space-y-6">
            {filteredUsers.map((user) => (
              <UserFollowItem
                key={user.id}
                user={user as Followers}
                onFollow={() => handleFollowToggle(user as Followers)}
              />
            ))}
          </div>
        ) : (
          // Jika tidak loading dan data kosong
          <SearchEmpty searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};

const SearchUserSkeleton = () => {
  return (
    <div className="flex items-start justify-between animate-pulse">
      <div className="flex gap-3 w-full">
        {/* Bulatan foto profil palsu */}
        <div className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="flex flex-col gap-2 w-1/2">
          {/* Baris nama & username palsu */}
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
          <div className="h-3 bg-gray-700 rounded w-full mt-1" />
        </div>
      </div>
      {/* Tombol follow palsu */}
      <div className="w-20 h-8 bg-gray-700 rounded-full" />
    </div>
  );
};

const SearchEmpty = ({ searchQuery }: { searchQuery: string }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
      <h2 className="text-2xl font-bold mb-2 text-white">
        No results for “{searchQuery}”
      </h2>
      <p className="text-[#71767b] text-[15px] max-w-[320px]">
        Try searching for something else or check the spelling of what you
        typed.
      </p>
    </div>
  );
};

export default SearchUsers;
