const ProfileSkeleton = () => {
  return (
    <div className="bg-[#1d1d1d] min-h-screen text-white animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6 px-4 py-3 border-b border-[#333]">
        <div className="w-5 h-5 bg-[#333] rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#333] rounded"></div>
          <div className="h-3 w-16 bg-[#333] rounded"></div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="h-48 w-full bg-[#222]"></div>

      {/* Avatar Skeleton */}
      <div className="relative px-4">
        <div className="absolute -top-16 left-4">
          <div className="w-32 h-32 rounded-full border-4 border-[#1d1d1d] bg-[#333]"></div>
        </div>

        {/* Action Button Skeleton */}
        <div className="flex justify-end pt-4">
          <div className="w-28 h-9 bg-[#333] rounded-full"></div>
        </div>
      </div>

      {/* Info Profil Skeleton */}
      <div className="px-4 mt-8 space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#333] rounded"></div>
          <div className="h-4 w-32 bg-[#333] rounded"></div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-[#333] rounded"></div>
          <div className="h-4 w-3/4 bg-[#333] rounded"></div>
        </div>
        <div className="flex gap-6 pt-4">
          <div className="h-4 w-24 bg-[#333] rounded"></div>
          <div className="h-4 w-24 bg-[#333] rounded"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex border-b border-[#333] mt-8">
        <div className="flex-1 py-4 flex justify-center">
          <div className="h-4 w-20 bg-[#333] rounded"></div>
        </div>
        <div className="flex-1 py-4 flex justify-center">
          <div className="h-4 w-20 bg-[#333] rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
