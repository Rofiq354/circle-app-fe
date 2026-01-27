import {
  createSlice,
  type PayloadAction,
  type SerializedError,
} from "@reduxjs/toolkit";
import { fetchMyProfile, updateProfile } from "./profileThunk";

export interface ProfileData {
  id: number;
  username: string;
  name: string;
  photo_profile: string | null;
  cover_photo: string | null;
  bio: string | null;
  follower_count: number;
  following_count: number;
  likes_count: number;
  threads_count: number;
  isFollowed: boolean;
}

interface ProfileState {
  myProfile: ProfileData | null;
  isSidebarVisible: boolean;
  isEditModalOpen: boolean;
  isMyProfileLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  myProfile: null,
  isSidebarVisible: true,
  isEditModalOpen: false,
  isMyProfileLoading: false,
  error: null,
};

interface ToggleFollowPayload {
  userId: number;
  isFollowing: boolean;
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    showSidebar: (state) => {
      state.isSidebarVisible = true;
    },
    hideSidebar: (state) => {
      state.isSidebarVisible = false;
    },
    toggleFollowOptimistic: (
      state,
      action: PayloadAction<ToggleFollowPayload>,
    ) => {
      const { isFollowing } = action.payload;
      const me = state.myProfile;

      if (me) {
        // Jika sebelumnya true (unfollow), angka following kita berkurang (-1)
        // Jika sebelumnya false (follow), angka following kita bertambah (+1)
        const adjustment = isFollowing ? -1 : 1;
        me.following_count += adjustment;
      }
    },
    clearProfileState: (state) => {
      state.myProfile = null;
      state.error = null;
    },
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- My Profile Section ---
      .addCase(fetchMyProfile.pending, handleMyProfilePending)
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.isMyProfileLoading = false;
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, handleRejected)

      // --- Update Profile Section ---
      .addCase(updateProfile.pending, handleMyProfilePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isMyProfileLoading = false;
        state.myProfile = action.payload.data;
      })
      .addCase(updateProfile.rejected, handleRejected);
  },
});

const handleMyProfilePending = (state: ProfileState) => {
  state.isMyProfileLoading = true;
  state.error = null;
};

const handleRejected = (
  state: ProfileState,
  action: { payload?: unknown; error?: SerializedError },
) => {
  state.isMyProfileLoading = false;
  if (action.payload) {
    state.error = (action.payload as string) || "Terjadi kesalahan.";
  }
};

export const {
  showSidebar,
  hideSidebar,
  clearProfileState,
  openEditModal,
  closeEditModal,
  toggleFollowOptimistic,
} = profileSlice.actions;
export default profileSlice.reducer;
