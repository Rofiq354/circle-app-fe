import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [form, setForm] = useState({ email: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    window.location.href = "/auth/reset-password";
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-md rounded-xl shadow-lg p-8 text-start">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-green-500 text-4xl font-bold">circle</h1>
        <p className="text-gray-300 mt-1 text-xl font-bold">Forgot password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email/Username *"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-full transition"
        >
          Send Instruction
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

export default ForgotPasswordPage;
