import api from "@/api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return rejectWithValue(err.response?.data);
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
      console.log(res.data.data);
      return res.data.data; // Sesuaikan dengan struktur res backend kamu
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
