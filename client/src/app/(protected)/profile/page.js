"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const storedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    setUser(storedUser);

  }, []);

  return (

    <div className="p-4 md:p-8">

      <div
        className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/10

        rounded-3xl

        p-8
        "
      >

        <div className="flex items-center gap-5">

          <div
            className="
            w-24
            h-24

            rounded-full

            bg-gradient-to-r
            from-cyan-500
            to-purple-600

            flex
            items-center
            justify-center

            text-white
            text-4xl
            font-bold
            "
          >
            {user?.name?.charAt(0)}
          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">
              {user?.name}
            </h1>

            <p className="text-slate-300">
              {user?.email}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}