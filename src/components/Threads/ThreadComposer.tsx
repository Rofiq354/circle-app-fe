import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { RootState } from "@/store";
import { openModal } from "@/store/like/threadSlice";
import type { ThreadComposerProps } from "@/types/threads";
import { PlusCircleIcon, User } from "lucide-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const ThreadComposer: React.FC<ThreadComposerProps> = ({
  onPost,
  placeholder = "What is happening?!",
  isPosting,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const [isError, setIsError] = useState(false);
  const userImage = useSelector(
    (state: RootState) => state.profile.myProfile?.photo_profile,
  );
  const contentRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    try {
      const val = contentRef.current?.value || "";
      onPost?.(val); // Kirim value ke parent
      if (contentRef.current) contentRef.current.value = ""; // Reset input setelah klik
    } catch (error) {
      console.error("Error when handling button click:", error);
    }
  };

  const imageIcon = (
    <div className="w-full h-full rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
      <User size={20} className="text-[#777]" />
    </div>
  );

  return (
    <div className={`w-full border-b border-[#222] px-6 py-3 ${className}`}>
      <h1 className="text-white text-2xl font-medium">Home</h1>

      <div className="flex items-center gap-3 w-full my-6">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-700">
          {userImage && !isError ? (
            <img
              src={userImage as string}
              alt="avatar"
              className="w-full h-full object-cover bg-[#333]"
              onError={() => setIsError(true)}
            />
          ) : (
            imageIcon
          )}
        </div>

        <input
          type="text"
          placeholder={placeholder}
          id="content"
          name="content"
          ref={contentRef}
          className="bg-transparent outline-none text-[#bdbdbd] placeholder:text-[#777] text-lg w-full"
        />

        {/* Likes */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-white/10"
            onClick={() => dispatch(openModal())}
          >
            <PlusCircleIcon className="w-6 h-6 cursor-pointer text-green-500" />
          </button>

          <button
            className="px-5 py-2 rounded-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold"
            onClick={handleButtonClick}
            disabled={isPosting}
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadComposer;
