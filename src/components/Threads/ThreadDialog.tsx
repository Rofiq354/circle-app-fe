import { createThread } from "@/services/thread.service";
import { X, ImagePlus } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThreadDialog = ({ isOpen, onClose }: ThreadDialogProps) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    // if (!content.trim() && !selectedImage) return;

    try {
      setIsPosting(true);
      const formData = new FormData();
      formData.append("content", content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await createThread(formData);
      if (response.status === "success") {
        toast.success(response.message);
        // Reset local state setelah sukses
        setContent("");
        setSelectedImage(null);
        onClose();
      }
    } catch (error) {
      console.error("Gagal posting:", error);
      toast.error("Waduh, gagal posting nih.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121212] w-full max-w-3xl mt-5 rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePost(); // Memanggil fungsi lokal
          }}
          className="flex flex-col p-5 relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>

          <div className="flex gap-4 mt-6">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-700">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              {selectedImage && (
                <div className="relative w-full max-h-80 overflow-hidden rounded-xl border border-white/10 mb-2">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="w-full object-cover"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)} // Handler langsung
                    className="cursor-pointer absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1.5"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <textarea
                placeholder="Write something..."
                value={content}
                onChange={(e) => setContent(e.target.value)} // Update state lokal
                id="content"
                name="content"
                autoFocus
                className="w-full bg-transparent border-none outline-none text-xl resize-none text-white placeholder:text-gray-600 focus:ring-0 min-h-30"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <label className="cursor-pointer text-[#22c55e] hover:bg-[#22c55e]/10 p-2 rounded-xl transition-all flex items-center justify-center">
              <ImagePlus size={28} strokeWidth={1.5} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                id="image"
                name="image"
              />
            </label>

            {selectedImage && (
              <span className="text-xs text-gray-400 mr-auto ml-2 truncate max-w-37.5">
                {selectedImage.name}
              </span>
            )}

            <button
              type="submit"
              disabled={isPosting || (!content.trim() && !selectedImage)}
              className="bg-[#00873c] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-[#00a84b] text-white font-bold px-10 py-2.5 rounded-full transition-all active:scale-95 shadow-lg"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default ThreadDialog;
