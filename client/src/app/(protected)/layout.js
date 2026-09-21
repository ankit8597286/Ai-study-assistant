import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function ProtectedLayout({ children }) {
  return (
    <div className="app-shell min-h-screen">
      <Sidebar />
      <main className="app-main min-h-screen md:ml-[17rem]">
        <div className="page-wrap mx-auto w-full max-w-[1500px]">
          <Navbar />
          {children}
        </div>
      </main>
    </div>
  );
}
