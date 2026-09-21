export default function Loading() {
  return (
    <main className="min-h-screen bg-[#070b14] p-4 sm:p-6">
      <div className="mx-auto flex min-h-[92vh] max-w-6xl items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 shadow-2xl">
          <span className="spinner-dot" />
          <span className="text-sm font-semibold text-cyan-100">Loading workspace...</span>
        </div>
      </div>
    </main>
  );
}
