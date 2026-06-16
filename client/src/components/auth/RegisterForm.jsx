"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await api.post("/auth/register", { name, email, password });

      setSuccessMessage("🎉 Account Created Successfully! Redirecting to Login...");

      // Reset Form
      setName("");
      setEmail("");
      setPassword("");

      // Redirect after 2 sec
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      // FIX 1: Replaced alert() with a proper inline error message
      setErrorMessage(
        error.response?.data?.message || "Registration Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] overflow-hidden px-4">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

      {/* Card */}
      <div className="relative w-full max-w-[430px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-8 text-white">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-2xl shadow-lg">
            <Sparkles size={32} />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Create Account
        </h2>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Join AI Study Assistant
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="animate-pulse bg-green-500/20 border border-green-400 text-green-300 rounded-xl p-3 mb-5 flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}

        {/* FIX 2: Error Message — replaced browser alert() with styled inline error */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 rounded-xl p-3 mb-5 flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User size={18} className="absolute left-4 top-4 text-gray-300" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-4 text-gray-300" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-4 pl-12 pr-4 outline-none focus:border-cyan-400 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-4 text-gray-300" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 sm:py-4 pl-12 pr-12 outline-none focus:border-cyan-400 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Login
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}