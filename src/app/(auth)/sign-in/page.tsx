"use client";

import { signIn } from "next-auth/react";
import { motion } from "motion/react"
import { useState } from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to continue
          </p>
        </motion.div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 pr-12 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </motion.button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </a>
        </p>
      </motion.form>
    </div>
  );
}
