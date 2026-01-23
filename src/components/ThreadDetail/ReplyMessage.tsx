import type { ThreadComposerProps } from "@/types/threads";
import { PlusCircleIcon } from "lucide-react";
import { useRef } from "react";

const ReplyMessage: React.FC<ThreadComposerProps> = ({
  onPost,
  onAttach,
  inputClick,
  placeholder = "Type your reply!",
  isPosting = false,
  className = "",
}) => {
  const contentRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    const val = contentRef.current?.value.trim() || "";

    if (val) {
      onPost?.(val);
      if (contentRef.current) contentRef.current.value = ""; // Reset input
    }
  };

  return (
    <div
      className={`w-full border-b border-[#333] bg-[#1d1d1d] sticky top-0 px-7 ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 w-full my-6"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-700">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-full h-full object-cover bg-white"
          />
        </div>

        <input
          type="text"
          placeholder={placeholder}
          disabled={isPosting}
          ref={contentRef}
          id="content"
          name="content"
          className="bg-transparent outline-none text-[#bdbdbd] placeholder:text-[#777] text-lg w-full"
        />

        {/* Likes */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10"
            onClick={onAttach || inputClick}
          >
            <PlusCircleIcon className="w-6 h-6 cursor-pointer text-green-500" />
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={isPosting}
          >
            {isPosting ? "Replying..." : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyMessage;
