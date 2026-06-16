"use client";

import { useEffect, useState } from "react";

import {
    Lock,
    Save,
} from "lucide-react";

import {
    updateProfile,
    changePassword,
} from "@/services/settingsService";

export default function SettingsPage() {

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [newPassword, setNewPassword,] = useState("");
   const [
  currentPassword,
  setCurrentPassword
] = useState("");

    useEffect(() => {

        const storedUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                )
            );

        if (storedUser) {

            setUser(
                storedUser
            );

            setName(
                storedUser.name
            );

        }

    }, []);

    const handleProfileUpdate =
        async () => {

            try {

                const res =
                    await updateProfile({
                        userId:
                            user.id,
                        name,
                    });

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        res.user
                    )
                );

                setMessage(
                    "✅ Profile updated successfully"
                );

                setTimeout(() => {
                    setMessage("");
                }, 3000);

            } catch (error) {

                setErrorMessage(
                    error.response?.data?.message ||
                    "Update Failed"
                );

                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);

            }

        };

    const handlePasswordChange =
        async () => {

            try {

                await changePassword({
                    userId:
                        user.id,

                    currentPassword,

                    newPassword,
                });

                setMessage(
                    "🔐 Password updated successfully"
                );

                setTimeout(() => {
                    setMessage("");
                }, 3000);

                setCurrentPassword(
                    ""
                );

                setNewPassword(
                    ""
                );

            } catch (error) {

                setErrorMessage(
                    error.response?.data?.message ||
                    "Password Update Failed"
                );

                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);

            }

        };

    return (

        <div className="p-4 md:p-8">

            <h1
                className="
        text-4xl
        font-bold
        text-white
        mb-8
        "
            >
                Settings ⚙️
            </h1>
            {
                message && (
                    <div
                        className="
      mb-6

      bg-green-500/20
      border
      border-green-500/30

      text-green-300

      px-4
      py-3

      rounded-xl

      animate-pulse
      "
                    >
                        {message}
                    </div>
                )
            }

            {
                errorMessage && (
                    <div
                        className="
      mb-6

      bg-red-500/20
      border
      border-red-500/30

      text-red-300

      px-4
      py-3

      rounded-xl
      "
                    >
                        {errorMessage}
                    </div>
                )
            }

            <div
                className="
        grid
        lg:grid-cols-2
        gap-6
        "
            >

                {/* Profile */}

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

                    <h2
                        className="
            text-white
            text-2xl
            font-bold
            mb-6
            "
                    >
                        Account Info
                    </h2>

                    <div className="space-y-4">

                        <div>

                            <label className="text-gray-300">
                                Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                className="
                mt-2
                w-full
                p-3

                rounded-xl

                bg-white/10

                text-white

                border
                border-white/10
                "
                            />

                        </div>

                        <div>

                            <label className="text-gray-300">
                                Email
                            </label>

                            <input
                                type="text"
                                value={
                                    user?.email ||
                                    ""
                                }
                                disabled
                                className="
                mt-2
                w-full
                p-3

                rounded-xl

                bg-white/5

                text-gray-400

                border
                border-white/10
                "
                            />

                        </div>

                        <button
                            onClick={
                                handleProfileUpdate
                            }
                            className="
              flex
              items-center
              gap-2

              bg-cyan-500
              hover:bg-cyan-600

              text-white

              px-5
              py-3

              rounded-xl
              "
                        >
                            <Save size={18} />
                            Save Changes
                        </button>

                    </div>

                </div>

                {/* Password */}

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

                    <h2
                        className="
            text-white
            text-2xl
            font-bold
            mb-6
            "
                    >
                        Change Password
                    </h2>

                    <div className="space-y-4">

                        <input
                            type="password"
                            placeholder="Current Password"
                            value={
                                currentPassword
                            }
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            className="
              w-full
              p-3

              rounded-xl

              bg-white/10

              text-white

              border
              border-white/10
              "
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            value={
                                newPassword
                            }
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            className="
              w-full
              p-3

              rounded-xl

              bg-white/10

              text-white

              border
              border-white/10
              "
                        />

                        <button
                            onClick={
                                handlePasswordChange
                            }
                            className="
              flex
              items-center
              gap-2

              bg-orange-500
              hover:bg-orange-600

              text-white

              px-5
              py-3

              rounded-xl
              "
                        >
                            <Lock size={18} />
                            Update Password
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}