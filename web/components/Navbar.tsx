"use client";

import Link from "next/link";
import UserButton from "./UserButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 h-20 flex items-center w-full bg-cloud-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-sage-green hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"
        >
          <span>🐾</span>
          <span className="hover:text-sunset-orange transition-colors">
            MeowMart
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-slate-grey hover:text-sage-green transition-colors"
          >
            Home
          </Link>
          <Link
            href="/items"
            className="text-slate-grey hover:text-sage-green transition-colors"
          >
            Adopt a Cat
          </Link>
          <Link
            href="/how-it-works"
            className="text-slate-grey hover:text-sage-green transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            className="text-slate-grey hover:text-sage-green transition-colors"
          >
            Contact
          </Link>
        </div>

        <UserButton />
      </div>
    </nav>
  );
}
