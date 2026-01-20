import api from "@/api/axios";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormErrors = {
  fullname?: string;
  email?: string;
  password?: string;
};

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const generateUsername = (fullname: string) => {
    return fullname
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_") // spasi → underscore
      .replace(/[^a-z0-9_]/g, ""); // buang karakter aneh
  };

  const payload = {
    username: generateUsername(form.fullname),
    fullname: form.fullname,
    email: form.email,
    password: form.password,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", payload);
      const { token } = res.data.data;

      localStorage.setItem("token", token);
      console.log("Registrasi berhasil", res.data);
      alert("Registrasi berhasil!");

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendErrors = error.response?.data?.message;

        if (typeof backendErrors === "object" && backendErrors !== null) {
          setErrors(backendErrors);
          return;
        }

        if (typeof backendErrors === "string") {
          setErrors({ email: backendErrors });
          console.error(error);
          return;
        }

        console.error(error);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  return (
    <div className="w-full max-w-md rounded-xl shadow-lg p-8 text-start">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-green-500 text-4xl font-bold">circle</h1>
        <p className="text-gray-300 mt-1 text-xl font-bold">
          Create account Circle
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border ${errors.fullname ? "border-red-500" : "border-gray-700"} focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {errors.fullname && (
            <p className="mt-1 text-xs text-red-500">{errors.fullname}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email *"
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

        <button
          type="submit"
          className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-full transition"
        >
          Create
        </button>
      </form>

      {/* Login */}
      <p className="text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-green-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
