import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout({
  children,
}) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
      <Sidebar />

      <main
  className="
    flex-1
    w-full
    p-4
    pt-16
    md:p-6
    md:pt-6
    overflow-y-auto
  "
>
  {children}
</main>
    </div>
  );
}