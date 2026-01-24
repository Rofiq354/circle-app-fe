import React, { useState } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import type { ProfileData } from "@/store/profile/profileSlice";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData | null;
  onSave: (formData: FormData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    username: initialData?.username || "",
    bio: initialData?.bio || "",
  });

  // console.log(initialData)

  const [preview, setPreview] = useState({
    photo_profile: initialData?.photo_profile,
    cover_photo: initialData?.cover_photo,
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo_profile: null,
    cover_photo: null,
  });

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }));
      setPreview((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("username", formData.username);
    data.append("bio", formData.bio);
    if (files.photo_profile) data.append("photo_profile", files.photo_profile);
    if (files.cover_photo) data.append("cover_photo", files.cover_photo);

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1f1f1f] w-full max-w-2xl rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333]">
          <h2 className="text-xl font-bold text-white">Edit profile</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-[#777] hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Banner & Avatar Section */}
          <div className="relative h-48 px-4 mt-4">
            {/* Banner Preview */}
            <div className="relative h-32 w-full rounded-xl overflow-hidden group">
              <img
                src={preview.cover_photo || "/default-banner.jpg"}
                className="w-full h-full object-cover opacity-60"
              />
              <label
                htmlFor="cover_photo"
                className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition"
              >
                <PhotoIcon className="w-8 h-8 text-white opacity-80" />
                <input
                  type="file"
                  id="cover_photo"
                  name="cover_photo"
                  hidden
                  onChange={(e) => handleFileChange(e, "cover_photo")}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Avatar Preview */}
            <div className="absolute -bottom-4 left-8">
              <div className="relative w-24 h-24 rounded-full border-4 border-[#1f1f1f] overflow-hidden group shadow-xl">
                <img
                  src={preview.photo_profile || "/default-avatar.png"}
                  className="w-full h-full object-cover opacity-60"
                />
                <label
                  htmlFor="photo_profile"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:bg-black/40 transition"
                >
                  <PhotoIcon className="w-6 h-6 text-white opacity-80" />
                  <input
                    type="file"
                    id="photo_profile"
                    name="photo_profile"
                    hidden
                    onChange={(e) => handleFileChange(e, "photo_profile")}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="p-6 pt-10 space-y-4">
            <div className="relative border border-[#333] rounded-lg p-2 focus-within:border-green-500 transition">
              <label htmlFor="name" className="text-xs text-[#777] px-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                id="name"
                name="name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-transparent text-white outline-none px-1 py-0.5"
                autoComplete="name"
              />
            </div>

            <div className="relative border border-[#333] rounded-lg p-2 focus-within:border-green-500 transition">
              <label htmlFor="username" className="text-xs text-[#777] px-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                id="username"
                name="username"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-transparent text-white outline-none px-1 py-0.5"
                autoComplete="username"
              />
            </div>

            <div className="relative border border-[#333] rounded-lg p-2 focus-within:border-green-500 transition">
              <label htmlFor="bio" className="text-xs text-[#777] px-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                id="bio"
                name="bio"
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full bg-transparent text-white outline-none px-1 py-0.5 resize-none"
              />
            </div>
          </div>

          {/* Footer Save */}
          <div className="flex justify-end p-6 border-t border-[#333]">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer font-bold py-2 px-8 rounded-full transition shadow-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
