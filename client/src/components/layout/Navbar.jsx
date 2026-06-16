"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        setUser(
          JSON.parse(storedUser)
        );
      }

    } catch (error) {
      console.log(error);
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";

  };

  return (
    <div
      className="
      bg-white/10
      backdrop-blur-xl
      border
      border-white/10
      rounded-2xl
      p-4
      flex
      justify-between
      items-center
      "
    >

      <div>

        <h2 className="text-white text-xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="text-gray-300 text-sm">
          AI Study Assistant
        </p>

      </div>

      <div className="flex items-center gap-4">

        <Bell
          size={20}
          className="text-white"
        />

        <div
          onClick={() =>
            setOpen(!open)
          }
          className="
              cursor-pointer
                w-10
                h-10
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-purple-600
                flex
                items-center
                justify-center
              text-white
                font-bold
  "
        >
          {user?.name?.charAt(0) || "A"}
        </div>

      </div>

      {
        open && (

          <div
            className="
      absolute
      right-0
      top-14

      w-64

      bg-slate-900

      border
      border-white/10

      rounded-2xl

      p-4

      shadow-2xl
      "
          >

            <h3 className="text-white font-bold">
              {user?.name}
            </h3>

            <p className="text-slate-400 text-sm">
              {user?.email}
            </p>

            <hr className="my-3 border-white/10" />

            <button
              onClick={
                handleLogout
              }
              className="
                    w-full
                  bg-red-500
                  hover:bg-red-600
                  text-white
                    rounded-xl
                    py-2
                    transition
                    cursor-pointer "
            >
              Logout
            </button>

          </div>

        )
      }

    </div>
  );
}