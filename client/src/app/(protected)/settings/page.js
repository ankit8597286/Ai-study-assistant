"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Save,
  Settings2,
  UserRound,
} from "lucide-react";
import { updateProfile, changePassword } from "@/services/settingsService";

export default function SettingsPage() {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return JSON.parse(localStorage.getItem("user") || "null")?.name || "";
    } catch {
      return "";
    }
  });
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const flash = (ok, text) => {
    setMessage(ok ? text : "");
    setErrorMessage(ok ? "" : text);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => {
      setMessage("");
      setErrorMessage("");
    }, 3200);
  };

  const handleProfileUpdate = async () => {
    const nextName = name.trim();
    if (!nextName) return flash(false, "Please enter your name.");

    try {
      setSavingProfile(true);
      const res = await updateProfile({ name: nextName });
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      setName(res.user?.name || nextName);
      flash(true, "Profile updated successfully.");
    } catch (error) {
      flash(false, error.userMessage || error.response?.data?.message || "Profile update failed.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return flash(false, "Enter both passwords.");
    if (newPassword.length < 6) return flash(false, "New password must be at least 6 characters.");

    try {
      setSavingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      flash(true, "Password updated successfully.");
    } catch (error) {
      flash(false, error.userMessage || error.response?.data?.message || "Password update failed.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="relative pb-12">
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><Settings2 size={13} /> Account settings</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Fine-tune your <span className="gradient-text">account.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Update your profile details, keep your account secure and make your workspace feel like yours.</p>
        </div>
      </section>

      {(message || errorMessage) && (
        <div className={`mb-5 flex items-start gap-2.5 rounded-2xl border p-4 text-sm reveal ${message ? "border-emerald-300/15 bg-emerald-300/[.055] text-emerald-100" : "border-rose-300/15 bg-rose-300/[.055] text-rose-100"}`}>
          {message ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
          <span>{message || errorMessage}</span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsCard
          icon={UserRound}
          title="Profile"
          description="Your display information."
          accent="cyan"
          delay="reveal-delay-1"
        >
          <div className="space-y-4">
            <Field label="Name" icon={UserRound}>
              <input className="input-glass pl-11" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Email" icon={Mail}>
              <input className="input-glass pl-11 opacity-70" value={user?.email || ""} disabled autoComplete="email" />
            </Field>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-600">Your email is managed by authentication.</p>
              <button onClick={handleProfileUpdate} disabled={savingProfile} className="btn-primary shrink-0">
                {savingProfile ? <><span className="spinner-dot" /> Saving...</> : <><Save size={17} /> Save changes</>}
              </button>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={LockKeyhole}
          title="Security"
          description="Change your password."
          accent="violet"
          delay="reveal-delay-2"
        >
          <div className="space-y-4">
            <Field label="Current password" icon={LockKeyhole}>
              <PasswordInput value={currentPassword} setValue={setCurrentPassword} visible={showCurrent} setVisible={setShowCurrent} placeholder="Current password" autoComplete="current-password" />
            </Field>
            <Field label="New password" icon={LockKeyhole}>
              <PasswordInput value={newPassword} setValue={setNewPassword} visible={showNew} setVisible={setShowNew} placeholder="New password" autoComplete="new-password" />
            </Field>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300/80" />
                Use at least 6 characters.
              </div>
              <button onClick={handlePasswordChange} disabled={savingPassword} className="btn-secondary shrink-0">
                {savingPassword ? <><span className="spinner-dot spinner-dot-dark" /> Updating...</> : <><LockKeyhole size={17} /> Update password</>}
              </button>
            </div>
          </div>
        </SettingsCard>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-700">AI Study Assistant · Developed by Ankit Kumar</p>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, accent, delay, children }) {
  const accentClasses = accent === "violet"
    ? "from-violet-300/15 to-fuchsia-300/10 text-violet-200 border-violet-300/10"
    : "from-cyan-300/15 to-violet-300/10 text-cyan-200 border-cyan-300/10";

  return (
    <section className={`glass-panel relative overflow-hidden p-6 sm:p-7 reveal ${delay}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-300/[.05] blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className={`icon-tile border bg-gradient-to-br ${accentClasses}`}><Icon size={19} /></div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-600">{description}</p>
          </div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-[.1em] text-slate-300">{label}</label>
      <div className="relative group">
        <Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-200" />
        {children}
      </div>
    </div>
  );
}

function PasswordInput({ value, setValue, visible, setVisible, placeholder, autoComplete }) {
  return (
    <div className="relative">
      <input
        className="input-glass pl-11 pr-12"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-500 transition hover:bg-white/[.06] hover:text-white"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
