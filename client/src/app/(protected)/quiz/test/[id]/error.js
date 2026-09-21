"use client";

import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestError({ reset }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-7 text-center sm:p-9">
        <div className="mx-auto icon-tile border-rose-300/15 bg-rose-300/[.06] text-rose-200">
          <AlertTriangle size={24} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-white">This test could not be opened</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">The test may have expired, the network may have dropped, or the backend may be unavailable.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button onClick={() => reset()} className="btn-primary flex-1"><RotateCcw size={16} /> Try again</button>
          <button onClick={() => router.replace("/quiz")} className="btn-secondary flex-1"><ArrowLeft size={16} /> Back to quiz</button>
        </div>
      </div>
    </div>
  );
}
