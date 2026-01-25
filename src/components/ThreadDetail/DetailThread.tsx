import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart as HeartIcon,
  MessagesSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getThreadById } from "@/services/thread.service";
import { formatTwitterDate } from "@/lib/times";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  addSingleThread,
  localToggleLike,
  selectThreadById,
  selectThreadImage,
} from "@/store/like/threadSlice";
import toast from "react-hot-toast";
import { toggleLikeAction } from "@/store/like/threadThunk";

interface DetailThreadProps {
  dataId?: string;
}

const DetailThread: React.FC<DetailThreadProps> = ({ dataId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const imageUrl = useSelector((state: RootState) =>
    selectThreadImage(state, Number(dataId)),
  );
  const [imageError, setImageError] = useState(false);

  const getThread = useSelector((state: RootState) =>
    selectThreadById(state, Number(dataId)),
  );

  useEffect(() => {
    if (!getThread) {
      const fetchData = async () => {
        try {
          const result = await getThreadById(Number(dataId));
          dispatch(addSingleThread(result));
        } catch (error) {
          console.error("Gagal mengambil detail thread:", error);
          toast.error("Gagal mengambil detail thread");
        }
      };

      fetchData();
    }
  }, [dataId, getThread, dispatch]);

  const handleLike = () => {
    dispatch(localToggleLike(Number(dataId)));
    dispatch(toggleLikeAction(Number(dataId)));
  };

  const profileUrl =
    getThread?.user.profile_picture || getThread?.user.photo_profile;

  if (!getThread) return <div>Loading...</div>;

  const { time, dayMonthYear } = formatTwitterDate(getThread?.created_at ?? "");
  const imageIcon = (
    <div className="w-full h-full rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
      <User size={20} className="text-[#777]" />
    </div>
  );

  return (
    <div className="w-full bg-[#1d1d1d]">
      {/* Header "Status" */}
      <div className="px-4 py-3 flex gap-3">
        <Link to="/" className="hover:bg-white/10 p-2 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-white text-2xl font-medium">Status</h1>
      </div>

      {/* Content Parent */}
      <div className="border-b border-[#333] py-4 px-6">
        {/* User Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
            {profileUrl && !imageError ? (
              <img
                src={profileUrl as string}
                alt="Indah Pra Karya"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              imageIcon
            )}
          </div>
          <div className="flex flex-col">
            <Link to={`/profile/${getThread?.user.username}`}>
              <span className="font-medium text-lg hover:underline cursor-pointer text-white">
                {getThread?.user?.name || getThread?.user?.fullname}
              </span>
            </Link>
            <span className="text-gray-500 text-[15px] lowercase">
              @{getThread?.user?.username}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-4">
          <p className="text-[17px] leading-relaxed text-gray-100">
            {getThread?.content}
          </p>
        </div>

        {imageUrl && (
          <div className="mt-3 w-4/5">
            <img
              src={imageUrl}
              alt="thread image"
              className="rounded-xl w-full max-h-87.5 bg-white object-cover border border-[#333]"
            />
          </div>
        )}

        {/* Metadata (Time & Date) */}
        <div className="py-2 border-gray-800 text-gray-500 text-[15px]">
          <span>{time}</span>
          <span className="mx-1">·</span>
          <span>{dayMonthYear}</span>
        </div>

        <div className="flex items-center gap-6 mt-3">
          {/* Like Button */}
          <div
            className="flex items-center gap-2 text-[#777] cursor-pointer group"
            onClick={() => handleLike()}
          >
            <HeartIcon
              className={`w-5 h-5 transition-transform active:scale-125 ${
                getThread?.isLiked
                  ? "text-red-500 fill-red-500 scale-110"
                  : "text-[#777]"
              }`}
            />
            <span
              className={`${getThread?.isLiked ? "text-white" : "text-[#777]"}`}
            >
              {getThread?.likes === 0 ? "" : getThread?.likes}
            </span>
          </div>

          {/* Reply Info */}
          <div className="flex items-center gap-2 text-[#777] cursor-pointer hover:text-blue-400 transition-colors">
            <MessagesSquare className="w-5 h-5" />
            <span>{getThread.reply === 0 ? "" : getThread.reply} Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailThread;
