"use client";

import Link from "next/link";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const router = useRouter();

  const [nama, setNama] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      alert(
        "Konfirmasi password tidak cocok"
      );

      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama,
          },
        },
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Registrasi berhasil"
    );

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">
            Daftar Akun
          </h1>

          <p className="mt-2 text-gray-500">
            Buat akun warga/admin
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nama Lengkap
            </label>

            <input
              type="text"
              placeholder="Nama lengkap"
              value={nama}
              onChange={(e) =>
                setNama(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Konfirmasi Password
            </label>

            <input
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 p-3 font-medium text-white transition hover:bg-green-700"
          >
            {loading
              ? "Loading..."
              : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}