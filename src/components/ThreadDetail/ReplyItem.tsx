import React from 'react';
import { Heart as HeartIcon, MessagesSquare } from 'lucide-react';
import type { Reply } from '@/types/reply';



const ReplyItem: React.FC<Reply> = ({user, content, image, created_at}) => {
  // Data dummy langsung di dalam komponen untuk keperluan tampilan
  const data = {
    id: 1,
    user: {
      fullname: "Menantu Idaman Ibumu",
      username: "ninanenen",
      profile_picture: "https://i.pravatar.cc/100?img=32",
    },
    content: `Untuk 6 tahun terakhir, yes hahaha!
Bukan bermaksud buat ngepush luck sampe batas terakhir, tapi semesta belum juga melunak  😁`,
    image: "",
    created_at: "2026-01-20T23:32:00Z",
    likes: 36,
    isLiked: false,
    reply: 291
  };

  // Helper sederhana untuk tampilan waktu
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return `${seconds} detik yang lalu`;
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-inherit">
      {/* Content Parent */}
      <div className="border-b border-[#333] py-4 px-7">
        <div className="flex gap-3">
          <img
            src={image ? image : data.user.profile_picture}
            alt="avatar"
            className="w-10 h-10 rounded-full bg-white object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white capitalize">
                {user.fullname ? user.fullname : data.user.fullname}
              </span>
              <span className="text-[#777] lowercase">@{ user.username ? user.username : data.user.username}</span>
              <span className="text-[#777] flex items-center gap-2"><span className='text-2xl text-inherit'>•</span> {timeAgo(created_at ? created_at : data.created_at)}</span>
            </div>

            <p className="text-[#bfbfbf] mt-2 whitespace-pre-wrap leading-relaxed">
              {content ? content : data.content}
            </p>

            {image ? image : data.image && (
              <div className="mt-3 w-4/5">
                <img
                  src={image ? image : data.image}
                  alt="thread image"
                  className="rounded-xl w-full max-h-87.5 bg-white object-cover border border-[#333]"
                />
              </div>
            )}

            <div className="flex items-center gap-6 mt-3">
              {/* Like Button */}
              <div className="flex items-center gap-2 text-[#777] cursor-pointer group">
                <HeartIcon
                  className={`w-5 h-5 transition-transform active:scale-125 ${
                    data.isLiked ? "text-red-500 fill-red-500 scale-110" : "text-[#777]"
                  }`}
                />
                <span className={`${data.isLiked ? "text-white" : "text-[#777]"}`}>
                  {data.likes}
                </span>
              </div>

              {/* Reply Info */}
              <div className="flex items-center gap-2 text-[#777] cursor-pointer hover:text-blue-400 transition-colors">
                <MessagesSquare className="w-5 h-5" />
                <span>{data.reply === 0 ? "" : data.reply} Replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;