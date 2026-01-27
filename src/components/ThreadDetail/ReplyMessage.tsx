import type { RootState } from "@/store";
import type { ThreadComposerProps } from "@/types/threads";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircleIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const ReplyMessage: React.FC<ThreadComposerProps> = ({
  onPost,
  placeholder = "Type your reply!",
  isPosting = false,
  className = "",
}) => {
  const userImage = useSelector(
    (state: RootState) => state.profile.myProfile?.photo_profile,
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Untuk menampilkan gambar
  const [showPreviewModal, setShowPreviewModal] = useState(false); // Kontrol modal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setPreviewUrl(url); // Simpan URL untuk <img>
      setShowPreviewModal(true); // Buka modal
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setShowPreviewModal(false);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
  };

  const handleConfirmImage = () => {
    if (previewUrl) {
      const fileInput = fileInputRef.current?.files?.[0];
      if (fileInput) setImage(fileInput);
    }
    setShowPreviewModal(false);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = contentRef.current?.value.trim() || "";

    if (val || image) {
      onPost?.(val, image);
      if (contentRef.current) contentRef.current.value = "";
      setImage(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div
      className={`w-full border-b border-[#333] bg-[#1d1d1d] py-6 sticky top-0 px-7 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-700">
          <img
            src={userImage || "https://i.pravatar.cc/40"}
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

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleChangeImages}
          accept="image/*"
          id="image"
          name="image"
        />

        <ImageDraftPreview
          image={image}
          previewUrl={previewUrl}
          isVisible={!showPreviewModal}
          onRemove={handleCancelImage}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10"
            onClick={() => fileInputRef.current?.click()}
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

        <ImagePreviewModal
          isOpen={showPreviewModal}
          previewUrl={previewUrl}
          onCancel={handleCancelImage}
          onConfirm={handleConfirmImage}
        />
      </form>
    </div>
  );
};

export default ReplyMessage;

/* Modal Image Preview ===================================================================== */

interface ImagePreviewModalProps {
  isOpen: boolean;
  previewUrl: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ImagePreviewModal = ({
  isOpen,
  previewUrl,
  onCancel,
  onConfirm,
}: ImagePreviewModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#1d1d1d] border border-[#333] rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#333] flex justify-between items-center">
              <h3 className="font-bold text-white text-lg">Preview Gambar</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white cursor-pointer p-1 transition"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image Box 1:1 Aspect */}
            <div className="p-4 flex justify-center bg-black/20">
              <div className="w-full max-w-xs aspect-square overflow-hidden rounded-lg">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 flex gap-3 justify-end bg-[#1d1d1d]">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 cursor-pointer text-white rounded-full font-medium hover:bg-white/5 transition"
              >
                Batalkan
              </button>
              <button
                onClick={onConfirm}
                type="button"
                className="px-6 py-2 cursor-pointer text-white bg-green-600 rounded-full font-medium hover:bg-green-700 transition"
              >
                Gunakan Gambar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* Image Draft Preview ===================================================================== */

interface ImageDraftPreviewProps {
  image: File | null;
  previewUrl: string | null;
  isVisible: boolean;
  onRemove: () => void;
}

const ImageDraftPreview = ({
  image,
  previewUrl,
  isVisible,
  onRemove,
}: ImageDraftPreviewProps) => {
  return (
    <AnimatePresence>
      {image && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="mt-3 relative inline-block group"
        >
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg">
            <img
              src={previewUrl!}
              className="w-full h-full object-cover"
              alt="Selected"
            />
            {/* Hover Overlay for Deleting */}
            <div
              onClick={onRemove}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <Trash2Icon className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <p className="text-[10px] text-green-500 mt-1 font-medium truncate w-24 text-center">
            {image.name}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
