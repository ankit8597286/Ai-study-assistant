"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  Sparkles,
  Target,
  Timer,
  User,
} from "lucide-react";
import api from "@/services/api";
import AuthField from "@/components/auth/AuthField";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setSuccessMessage("Account created. Taking you to sign in...");
      router.prefetch("/login");
      router.replace("/login");
    } catch (error) {
      setErrorMessage(
        error.userMessage ||
          error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Start learning smarter"
      title={<>Build a study habit <span className="gradient-text">that sticks.</span></>}
      copy="Create a focused learning workspace that turns your study material into summaries, flashcards, plans and timed practice."
      visualTitle="What you can do here"
      visualItems={[
        [FileText, "Organize study material", "Keep uploaded PDFs and notes easy to revisit."],
        [Target, "Practice with intent", "Create targeted quizzes from a topic or syllabus."],
        [Timer, "Stay consistent", "Plan study time around your exam date and schedule."],
      ]}
    >
      <div className="mb-7 auth-form-intro">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 text-[#061018] shadow-[0_12px_32px_rgba(103,232,249,.15)]">
          <Sparkles size={21} />
        </div>
        <div className="auth-mini-label">New learner</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-white">Create account</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">A cleaner place to study starts here.</p>
      </div>

      {successMessage && <AuthAlert tone="success" icon={CheckCircle}>{successMessage}</AuthAlert>}
      {errorMessage && <AuthAlert tone="error" icon={AlertCircle}>{errorMessage}</AuthAlert>}

      <form onSubmit={handleRegister} className="space-y-4">
        <AuthField icon={User} label="Full name">
          <input
            className="auth-input"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </AuthField>

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
              autoComplete="new-password"
              placeholder="Create a password"
              minLength={6}
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

        <div className="flex items-center gap-2 px-1 text-[11px] text-slate-600">
          <BrainCircuit size={14} className="text-violet-200/70" />
          Use at least 6 characters for your password.
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? (
            <>
              <span className="spinner-dot" /> Creating account...
            </>
          ) : (
            <>Create account <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" prefetch className="font-semibold text-cyan-200 transition hover:text-white">Sign in</Link>
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
