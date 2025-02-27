"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCardWrapper from "./AuthCardWrapper";
import AuthOptions from "./AuthOptions";

const catEmojis = ["🐈", "😻", "😼", "😽", "🙀", "😿", "😹", "🐾"];

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [randomCatEmoji, setRandomCatEmoji] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRandomCatEmoji(catEmojis[Math.floor(Math.random() * catEmojis.length)]);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(
        "http://localhost:8080/Authentication/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
          credentials: "include",
        }
      );

      const text = await response.text();

      if (text === "Login successful") {
        router.push("/");
        window.location.reload();
      } else {
        setError(text);
      }
    } catch (e) {
      if (e instanceof Error && e.message) {
        setError(e.message);
      } else {
        setError("Failed to connect to the server");
      }
    }
  };

  return (
    <AuthCardWrapper>
      <div className="flex items-center justify-center mb-6">
        <div className="text-2xl font-bold text-sage-green flex items-center gap-2">
          <span className="hover:scale-[3] transition-transform [transition-duration:5000ms]">
            {randomCatEmoji}
          </span>
          <span className="hover:text-sunset-orange transition-colors">
            MeowMart
          </span>
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-bold tracking-tight text-midnight-blue text-center">
        Sign in to your account
      </h2>
      <p className="mt-1 text-sm text-slate-gray text-center">
        Or{" "}
        <Link
          href="/signup"
          className="font-medium text-sunset-orange hover:text-sunset-orange/90 transition-colors"
        >
          create a new account
        </Link>
      </p>

      {error && (
        <div className="bg-sunset-orange/30 border border-sunset-orange text-sunset-orange px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="relative block w-full rounded-md border border-midnight-blue px-3 py-2 text-midnight-blue placeholder-midnight-blue focus:outline-none focus:ring-2 focus:ring-sunset-orange/50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full rounded-md border border-midnight-blue px-3 py-2 text-midnight-blue placeholder-midnight-blue focus:outline-none focus:ring-2 focus:ring-sunset-orange/50"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg bg-sunset-orange px-3 py-2 text-sm font-semibold text-cloud-white hover:bg-sunset-orange/90 transition-all hover:translate-y-1"
          >
            Sign in
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-full bg-slate-gray/30"></div>
            <span className="text-sm text-slate-gray">or</span>
            <div className="h-px w-full bg-slate-gray/30"></div>
          </div>

          <p className="text-sm font-semibold text-slate-gray text-center">
            Continue with
          </p>

          <AuthOptions />
        </div>
      </form>
    </AuthCardWrapper>
  );
}
