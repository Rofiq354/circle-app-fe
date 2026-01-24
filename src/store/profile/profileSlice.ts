import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchProfile, updateProfile } from "./profileThunk";

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
}

interface ProfileState {
  data: ProfileData | null;
  isEditModalOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  isEditModalOpen: false,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    updateFollowCount: (
      state,
      action: PayloadAction<{ type: "follow" | "unfollow" }>,
    ) => {
      if (state.data) {
        if (action.payload.type === "follow") {
          state.data.follower_count += 1;
        } else {
          state.data.follower_count -= 1;
        }
      }
    },
    clearProfile: (state) => {
      state.data = null;
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
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload adalah result dari API di buat di thunk
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // // Handle Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProfile,
  updateFollowCount,
  clearProfile,
  openEditModal,
  closeEditModal,
} = profileSlice.actions;
export default profileSlice.reducer;
