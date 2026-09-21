"use client";

import { Bell, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/authService";

const titles = {
  "/dashboard": ["Dashboard", "Your learning command center"],
  "/upload": ["Upload PDF", "Turn study material into a concise AI summary"],
  "/summary": ["Summary", "Browse and revisit your generated notes"],
  "/flashcards": ["Flashcards", "Practice active recall"],
  "/planner": ["Planner", "Build a study routine around your deadline"],
  "/quiz": ["Quiz & Tests", "Generate timed practice in seconds"],
  "/history": ["History", "Your uploaded study material"],
  "/profile": ["Profile", "Your account overview"],
  "/settings": ["Settings", "Manage your account"],
};

export default function Navbar() {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const titleData =
    titles[pathname] ||
    Object.entries(titles).find(([key]) => pathname.startsWith(`${key}/`))?.[1] ||
    ["AI Study Assistant", "Your personal learning workspace"];

  return (
    <header className="sticky top-3 z-30 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/9 bg-[#0b0e1a]/78 px-3 py-3 shadow-2xl backdrop-blur-2xl sm:px-4">
      <div className="min-w-0 pl-12 md:pl-0">
        <div className="flex items-center gap-2">
          <span className="hidden h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.8)] sm:block" />
          <p className="truncate text-sm font-semibold text-white/95">{titleData[0]}</p>
        </div>
        <p className="mt-0.5 hidden truncate text-[11px] text-slate-500 sm:block">{titleData[1]}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button className="relative hidden h-10 w-10 place-items-center rounded-xl border border-white/8 bg-white/[.035] text-slate-400 transition hover:bg-white/[.06] hover:text-white sm:grid" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(103,232,249,.9)]" />
        </button>

        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[.04] px-2 py-1.5 transition hover:bg-white/[.07]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 font-display font-bold text-[#061018]">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-[130px] truncate text-xs font-semibold text-white">{user?.name || "Student"}</span>
              <span className="block text-[10px] text-slate-500">Learner account</span>
            </span>
            <ChevronDown size={15} className={`hidden text-slate-500 transition-transform sm:block ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+.6rem)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1d]/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-xl bg-white/[.04] p-3">
                <p className="font-semibold text-white">{user?.name || "Student"}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{user?.email || ""}</p>
              </div>
              <Link prefetch href="/profile" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[.05] hover:text-white">
                <UserRound size={16} /> Profile
              </Link>
              <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 hover:bg-rose-400/8">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
