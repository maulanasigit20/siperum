"use client";

import Link from "next/link";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { motion } from "framer-motion";

import Image from "next/image";

export default function LoginPage() {
  const supabase = createClient();

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
  <div className="relative h-screen overflow-hidden">
    {/* Background */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/images/perumahan-bg.png')",
      }}
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60" />

    {/* Content */}
    <div className="relative z-10 flex h-full">
      {/* Left Section */}
      <div className="hidden w-1/2 flex-col justify-center px-16 text-white lg:flex">
        <h1 className="text-6xl font-bold">
          SIPERUM
        </h1>

        <p className="mt-4 max-w-lg text-xl text-white/80">
          Sistem Informasi Pengelolaan
          Perumahan Modern untuk
          membantu pengurus dan warga
          dalam administrasi, pembayaran,
          dan komunikasi.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="text-3xl font-bold">
              350+
            </div>

            <div className="mt-1 text-white/70">
              Warga
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="text-3xl font-bold">
              120
            </div>

            <div className="mt-1 text-white/70">
              Kepala Keluarga
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="text-3xl font-bold">
              95%
            </div>

            <div className="mt-1 text-white/70">
              Pembayaran Tepat Waktu
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <div className="text-3xl font-bold">
              15
            </div>

            <div className="mt-1 text-white/70">
              Pengumuman Bulan Ini
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl">
              🏠
            </div>

            <h2 className="text-3xl font-bold text-white">
              Login
            </h2>

            <p className="mt-2 text-white/70">
              Masuk ke akun SIPERUM
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm text-white">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/60 outline-none backdrop-blur-md"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="********"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/60 outline-none backdrop-blur-md"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 p-3 font-semibold text-white transition hover:bg-green-700"
            >
              {loading
                ? "Loading..."
                : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-300"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}