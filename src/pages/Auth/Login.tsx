import api from "@/api/axios";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchMe } from "@/store/auth/authThunk";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormErrors = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", form);
      await dispatch(fetchMe());
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendErrors = error.response?.data?.message;

        if (typeof backendErrors === "object") {
          setErrors(backendErrors);
        } else if (typeof backendErrors === "string") {
          setErrors({ email: backendErrors });
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="w-full max-w-md rounded-xl shadow-lg p-8 text-start">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-green-500 text-4xl font-bold">circle</h1>
        <p className="text-gray-300 mt-1 text-xl font-bold">Login to Circle</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email/Username *"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border ${errors.email ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password *"
            className={`w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border ${errors.password ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-gray-400 hover:text-green-500"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-full transition"
        >
          Login
        </button>
      </form>

      {/* Register */}
      <p className="text-sm text-gray-400 mt-6">
        Don't have an account yet?{" "}
        <Link to="/auth/register" className="text-green-500 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
