
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}) {

  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (!token) {

      router.replace("/login");

    } else {

      setAuthorized(true);

    }

  }, [router]);

  if (!authorized) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  }

  return children;
}