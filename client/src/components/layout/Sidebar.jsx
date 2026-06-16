"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Brain,
  Calendar,
  LogOut,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      link: "/dashboard",
    },
    {
      name: "Upload PDF",
      icon: FileText,
      link: "/upload",
    },
    {
      name: "Summary",
      icon: BookOpen,
      link: "/summary",
    },
    {
      name: "Flashcards",
      icon: Brain,
      link: "/flashcards",
    },
    {
      name: "Planner",
      icon: Calendar,
      link: "/planner",
    },
    {
      name: "History",
      icon: FileText,
      link: "/history",
    },
    {
      name: "Profile",
      icon: User,
      link: "/profile",
    },
    {
      name: "Settings",
      icon: Settings,
      link: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");

    document.cookie =
      "token=; Max-Age=0; path=/";

    router.push("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className=" md:hidden fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-xl text-white " >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-72
          z-50
          bg-slate-800/90
          backdrop-blur-xl
          border-r
          border-white/10
          text-white
          flex
          flex-col
          transition-transform
          duration-300

          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            AI Study
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-2">
          {menus.map((item, index) => {
            const Icon = item.icon;

            const active =
              pathname === item.link;

            return (
              <Link
                key={index}
                href={item.link}
                onClick={() =>
                  setIsOpen(false)
                }
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-200

                  ${active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-white/10"
                  }
                `}
              >
                <Icon size={20} />
                <span>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className=" w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition ">
            <LogOut size={20} />
            Logout
          </button>
          <div className="mt-auto pt-8 text-center">
            <p className="text-gray-400 text-xs">
              AI Study Assistant
            </p>

            <p className="text-cyan-400 text-sm font-semibold">
              Developed by Ankit Kumar
            </p>

            <p className="text-white font-bold">

            </p>
          </div>
        </div>
      </aside>
    </>
  );
}