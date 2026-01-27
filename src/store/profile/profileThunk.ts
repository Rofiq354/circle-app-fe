import api from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile");
      return res.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return rejectWithValue(
            err.response?.data || "Gagal memuat my profil",
          );
        }
      }
      return rejectWithValue("Terjadi kesalahan sistem");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          return rejectWithValue(
            err.response?.data?.message || "Gagal update profile",
          );
        }
      }
      return rejectWithValue("Terjadi kesalahan sistem");
    }
  },
);
