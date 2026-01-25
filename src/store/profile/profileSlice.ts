import {
  createSlice,
  type PayloadAction,
  type SerializedError,
} from "@reduxjs/toolkit";
import {
  fetchMyProfile,
  fetchProfile,
  // toggleFollow,
  updateProfile,
} from "./profileThunk";

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
  viewedProfile: ProfileData | null;
  isSidebarVisible: boolean;
  isEditModalOpen: boolean;
  isMyProfileLoading: boolean;
  isViewedProfileLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  myProfile: null,
  viewedProfile: null,
  isSidebarVisible: true,
  isEditModalOpen: false,
  isMyProfileLoading: false,
  isViewedProfileLoading: false,
  error: null,
};

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
    setProfile: (state, action: PayloadAction<ProfileData>) => {
      state.viewedProfile = action.payload;
    },
    toggleFollowOptimistic: (state) => {
      const target = state.viewedProfile;
      const me = state.myProfile;

      if (target) {
        const isNowFollowing = !target.isFollowed;

        // Update Target (Followers)
        target.isFollowed = isNowFollowing;
        target.follower_count += isNowFollowing ? 1 : -1;

        // Update Saya (Following) - Sinkronisasi otomatis
        if (me) {
          me.following_count += isNowFollowing ? 1 : -1;
        }
      }
    },
    clearProfile: (state) => {
      state.viewedProfile = null;
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

      // --- Viewed Profile Section ---
      .addCase(fetchProfile.pending, (state) => {
        handleViewedProfilePending(state);
        state.viewedProfile = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isViewedProfileLoading = false;
        state.viewedProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, handleRejected)

      // --- Update Profile Section ---
      .addCase(updateProfile.pending, handleMyProfilePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isMyProfileLoading = false;
        const updatedData = action.payload.data;
        state.myProfile = updatedData;
        if (state.viewedProfile?.id === updatedData.id) {
          state.viewedProfile = updatedData;
        }
      })
      .addCase(updateProfile.rejected, handleRejected);
  },
});

const handleMyProfilePending = (state: ProfileState) => {
  state.isMyProfileLoading = true;
  state.error = null;
};

const handleViewedProfilePending = (state: ProfileState) => {
  state.isViewedProfileLoading = true;
  state.error = null;
};

const handleRejected = (
  state: ProfileState,
  action: { payload?: unknown; error?: SerializedError },
) => {
  state.isMyProfileLoading = false;
  state.isViewedProfileLoading = false;
  if (action.payload) {
    state.error = (action.payload as string) || "Terjadi kesalahan.";
  }
};

export const {
  showSidebar,
  hideSidebar,
  setProfile,
  clearProfile,
  openEditModal,
  closeEditModal,
  toggleFollowOptimistic,
} = profileSlice.actions;
export default profileSlice.reducer;
