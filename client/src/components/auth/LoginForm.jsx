"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AlertCircle,
  BrainCircuit,
  BookOpenText,
  CalendarDays,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import api from "@/services/api";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      if (res.data.token) localStorage.setItem("token", res.data.token);

      setSuccessMessage("Signed in successfully.");
      router.prefetch("/dashboard");
      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.userMessage ||
          error.response?.data?.message ||
          "We couldn't sign you in. Please check your email and password."
      );
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Welcome back"
      title={<>Your next study session <span className="gradient-text">starts here.</span></>}
      copy="Keep your PDFs, AI summaries, flashcards, plans and tests inside one calm, focused workspace."
      visualTitle="One workspace. Less friction."
      visualItems={[
        [BookOpenText, "Read less, understand more", "Turn dense material into student-friendly summaries."],
        [BrainCircuit, "Recall on demand", "Practice with AI-generated flashcards and tests."],
        [CalendarDays, "Study with a plan", "Organize revision around your exam date."],
      ]}
    >
      <div className="mb-7 auth-form-intro">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 text-[#061018] shadow-[0_12px_32px_rgba(103,232,249,.15)]">
          <Sparkles size={21} />
        </div>
        <div className="auth-mini-label">Student workspace</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-white">Sign in</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">Use your account to continue learning.</p>
      </div>

      {successMessage && <AuthAlert tone="success" icon={CheckCircle}>{successMessage}</AuthAlert>}
      {errorMessage && <AuthAlert tone="error" icon={AlertCircle}>{errorMessage}</AuthAlert>}

      <form onSubmit={handleLogin} className="space-y-4">
        <AuthField icon={Mail} label="Email">
          <input
            className="auth-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </AuthField>

        <AuthField icon={Lock} label="Password">
          <div className="relative">
            <input
              className="auth-input pr-12"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-500 transition hover:bg-white/[.06] hover:text-cyan-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </AuthField>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? (
            <>
              <span className="spinner-dot" /> Signing in...
            </>
          ) : (
            <>Continue to workspace <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here? <Link href="/register" prefetch className="font-semibold text-cyan-200 transition hover:text-white">Create an account</Link>
      </p>
    </AuthShell>
  );
}

function AuthAlert({ tone, icon: Icon, children }) {
  const styles =
    tone === "success"
      ? "border-emerald-300/15 bg-emerald-300/[.055] text-emerald-100"
      : "border-rose-300/15 bg-rose-300/[.055] text-rose-100";

  return (
    <div className={`mb-5 flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm ${styles}`}>
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
