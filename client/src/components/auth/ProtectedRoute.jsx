
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}) {

  const router = useRouter();

  const [authorized] = useState(() =>
    typeof window !== "undefined" && Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    if (!authorized) {
      router.replace("/login");
    }
  }, [authorized, router]);

  if (!authorized) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  }

  return children;
}