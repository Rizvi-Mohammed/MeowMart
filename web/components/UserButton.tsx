"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function UserButton() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const usernameCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("username=")
    );
    if (usernameCookie) {
      const username = usernameCookie.split("=")[1];
      setCurrentUser(decodeURIComponent(username));
    }
  }, []);

  const getAvatar = (name: string | null) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return currentUser ? (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="flex items-center px-3.5 py-2 space-x-2 rounded-full border border-[#738678]/20 hover:border-[#738678]/40 bg-[#F9FAFB]/10 hover:bg-[#738678]/10 transition-all duration-300"
      >
        <div className="rounded-full size-7 bg-[#FF6B6B] flex items-center justify-center text-[#F9FAFB] font-medium">
          {getAvatar(currentUser)}
        </div>
        <span className="text-[#FF6B6B] font-medium capitalize">
          {currentUser}
        </span>
      </Link>
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="px-4 py-2 rounded-md max-md:text-sm font-medium text-[#738678] hover:bg-[#738678]/10 transition-all duration-300"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 rounded-md max-md:text-sm font-medium bg-[#FF6B6B] text-[#F9FAFB] hover:bg-[#FF6B6B]/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Sign Up
      </Link>
    </div>
  );
}
