"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/authService";
import {
  LayoutDashboard, FileUp, BookOpenText, BrainCircuit, CalendarDays,
  LogOut, UserRound, Settings2, ClipboardCheck, Menu, X, Sparkles,
  History, ChevronRight,
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
  { name: "Upload PDF", icon: FileUp, link: "/upload" },
  { name: "Summary", icon: BookOpenText, link: "/summary" },
  { name: "Flashcards", icon: BrainCircuit, link: "/flashcards" },
  { name: "Planner", icon: CalendarDays, link: "/planner" },
  { name: "Quiz & Tests", icon: ClipboardCheck, link: "/quiz" },
  { name: "History", icon: History, link: "/history" },
  { name: "Profile", icon: UserRound, link: "/profile" },
  { name: "Settings", icon: Settings2, link: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.replace("/login");
    setIsOpen(false);
  };

  const isActive = (link) =>
    pathname === link || (link !== "/dashboard" && pathname.startsWith(`${link}/`));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className="md:hidden fixed left-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-[#0d1022]/85 text-white shadow-xl backdrop-blur-xl"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[60] flex w-[17rem] -translate-x-full flex-col border-r border-white/10 bg-[#080a16]/92 px-3 py-4 backdrop-blur-2xl transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : ""
      }`}>
        <div className="mb-5 flex items-center justify-between px-2">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="group flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-violet-500 text-[#061017] shadow-[0_0_30px_rgba(103,232,249,.18)]">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-200/80">AI Study</div>
              <div className="font-display text-lg font-bold text-white">Assistant</div>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="mx-2 mb-3 rounded-2xl border border-white/8 bg-white/[.035] p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-2.5 w-2.5 place-items-center rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(94,240,181,.7)]" />
            <span className="text-xs font-semibold text-slate-300">Workspace ready</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Learn faster. Recall smarter.</p>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-1">
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Workspace</p>
          {menus.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                prefetch={false}
                onMouseEnter={() => router.prefetch(item.link)}
                onFocus={() => router.prefetch(item.link)}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                  active
                    ? "border border-cyan-300/15 bg-gradient-to-r from-cyan-300/10 to-violet-400/10 text-white shadow-[inset_0_0_28px_rgba(103,232,249,.035)]"
                    : "text-slate-400 hover:bg-white/[.045] hover:text-white"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-xl border ${
                  active ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200" : "border-white/7 bg-white/[.025] text-slate-500 group-hover:text-slate-200"
                }`}>
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold">{item.name}</span>
                <ChevronRight size={15} className={`transition-transform ${active ? "text-cyan-200 translate-x-0" : "text-slate-700 -translate-x-1 group-hover:translate-x-0"}`} />
              </Link>
            );
          })}

          <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Account</p>
          {menus.slice(7).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                prefetch={false}
                onMouseEnter={() => router.prefetch(item.link)}
                onFocus={() => router.prefetch(item.link)}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                  active ? "bg-white/[.07] text-white" : "text-slate-400 hover:bg-white/[.045] hover:text-white"
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/7 bg-white/[.025]">
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-white/8 pt-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-rose-300/90 transition hover:bg-rose-400/8 hover:text-rose-200">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-rose-300/10 bg-rose-300/5"><LogOut size={18} /></span>
            <span className="text-sm font-semibold">Sign out</span>
          </button>
          <div className="px-3 pb-1 pt-3">
            <p className="text-[10px] uppercase tracking-[.15em] text-slate-600">Built for learning</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">Developed by <span className="text-cyan-200">Ankit Kumar</span></p>
          </div>
        </div>
      </aside>
    </>
  );
}
