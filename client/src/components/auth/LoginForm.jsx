"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle, Sparkles, AlertCircle } from "lucide-react";

import api from "@/services/api";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await api.post("/auth/login", { email, password });

      // FIX 1: Removed duplicate localStorage.setItem for "user"
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // FIX 2: Also store token if your API returns one
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setSuccessMessage("🎉 Login Successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] overflow-hidden px-4 sm:px-6 lg:px-8">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

      {/* Card */}
      <div className="relative w-full max-w-[420px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-8 text-white">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-2xl shadow-lg">
            <Sparkles size={32} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Welcome Back
        </h2>

        <p className="text-center text-gray-300 mt-2 mb-8 text-sm sm:text-base">
          Login to AI Study Assistant
        </p>

        {/* FIX 3: Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-400 text-green-300 rounded-xl p-3 mb-5 flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* FIX 4: Error Message — was missing from JSX entirely */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 rounded-xl p-3 mb-5 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-4 text-gray-300" />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-4 text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-4 pl-12 pr-12 outline-none focus:border-cyan-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center pt-2">
            <p className="text-gray-300 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Register
              </Link>
            </p>
            {/* Footer Credit */}

            <div className="mt-8 text-center border-t border-white/10 pt-4">
              <p className="text-gray-400 text-sm">
                AI Study Assistant
              </p>

              <p className="text-cyan-400 font-semibold">
                Developed by Ankit Kumar
              </p>
            </div>
          </div>

        </form>

      </div>

    </div>

  );
}