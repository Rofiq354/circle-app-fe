import type { ThreadComposerProps } from "@/types/threads";
import { PlusCircleIcon } from "lucide-react";

const ThreadComposer: React.FC<ThreadComposerProps> = ({
  value,
  onChange,
  onPost,
  onAttach,
  placeholder = "What is happening?!",
  isPosting = false,
  className = "",
}) => {
  return (
    <div className={`w-11/12 border-b border-[#222] px-6 ${className}`}>
      <h1 className="text-white text-2xl font-medium">Home</h1>

      <div className="flex items-center gap-3 w-full my-6">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          className="bg-transparent outline-none text-[#bdbdbd] placeholder:text-[#777] text-lg w-full"
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Likes */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-white/10"
            onClick={onAttach}
          >
            <PlusCircleIcon className="w-6 h-6 cursor-pointer text-green-500" />
          </button>

          <button
            className="px-5 py-2 rounded-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold"
            onClick={onPost}
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
