"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import StatCard from "@/components/dashboard/StatCard";

import { getDashboardStats } from "@/services/dashboardService";
import { useRouter } from "next/navigation";

import {
  FileText,
  BookOpen,
  Calendar,
  Upload,
  History,
  Brain,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [recentPDFs, setRecentPDFs] =
    useState([]);

  const [recentPlans, setRecentPlans] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const router = useRouter();


  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }

  const fetchData = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data.stats);
      setRecentPDFs(data.recentPDFs);
      setRecentPlans(data.recentPlans);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-cyan-400 text-3xl font-bold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Header */}

      <div className="mt-8">

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Welcome Back{user?.name ? `, ${user.name}` : ""} 👋
        </h1>

        <p className="text-slate-300 mt-3">
          Manage your AI Study Assistant from one place.
        </p>

      </div>

      {/* Stats */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

        <StatCard
          title="My PDFs"
          value={
            stats?.totalPDFs || 0
          }
          icon={FileText}
        />

        <StatCard
          title="My Summaries"
          value={
            stats?.totalPDFs || 0
          }
          icon={BookOpen}
        />

        <StatCard
          title="My Study Plans"
          value={
            stats?.totalPlans || 0
          }
          icon={Calendar}
        />

        <StatCard
          title="My Flashcards"
          value={
            stats?.totalFlashcards || 0
          }
          icon={Brain}
        />

      </div>

      {/* Content */}

      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        {/* Recent PDFs */}

        <div
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-6
          "
        >

          <h2 className="text-white text-xl font-bold mb-5">
            📄 My Recent PDFs
          </h2>

          <div className="space-y-3">

            {recentPDFs.length >
              0 ? (
              recentPDFs.map(
                (pdf) => (
                  <div
                    key={pdf._id}
                    className="
                    bg-white/5
                    p-3
                    rounded-xl
                    text-gray-200
                    "
                  >
                    {pdf.fileName}
                  </div>
                )
              )
            ) : (
              <p className="text-gray-400">
                No PDFs Uploaded
              </p>
            )}

          </div>

        </div>

        {/* Recent Plans */}

        <div
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-6
          "
        >

          <h2 className="text-white text-xl font-bold mb-5">
            📅 My Recent Plans
          </h2>

          <div className="space-y-3">

            {recentPlans.length >
              0 ? (
              recentPlans.map(
                (plan) => (
                  <div
                    key={plan._id}
                    className="
                    bg-white/5
                    p-3
                    rounded-xl
                    text-gray-200
                    "
                  >
                    {plan.subject}
                  </div>
                )
              )
            ) : (
              <p className="text-gray-400">
                No Plans Generated
              </p>
            )}

          </div>

        </div>

        {/* Quick Actions */}

        <div
          className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-6
          "
        >

          <h2 className="text-white text-xl font-bold mb-5">
            ⚡ Quick Actions
          </h2>

          <div className="space-y-4">

            <Link href="/upload">

              <button
                className="
                w-full
                flex
                items-center
                gap-3
                bg-cyan-500
                hover:bg-cyan-600
                text-white
                rounded-xl
                p-4
                transition
                "
              >
                <Upload size={20} />
                Upload PDF
              </button>

            </Link>

            <Link href="/history">

              <button
                className="
                w-full
                flex
                items-center
                gap-3
                bg-green-600
                hover:bg-green-700
                text-white
                rounded-xl
                p-4
                transition
                "
              >
                <History size={20} />
                PDF History
              </button>

            </Link>

            <Link href="/planner">

              <button
                className="
                w-full
                flex
                items-center
                gap-3
                bg-orange-500
                hover:bg-orange-600
                text-white
                rounded-xl
                p-4
                transition
                "
              >
                <Brain size={20} />
                Study Planner
              </button>

            </Link>

          </div>

        </div>

      </div>
    </>
  );
}