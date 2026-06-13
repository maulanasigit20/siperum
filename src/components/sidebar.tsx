"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  LayoutDashboard,
  Wallet,
  Users,
  FileText,
  LogOut,
  Home,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transaksi",
    href: "/transaksi",
    icon: Wallet,
  },
  {
    name: "Warga",
    href: "/warga",
    icon: Users,
  },
  {
    name: "Laporan",
    href: "/laporan",
    icon: FileText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [profile, setProfile] =
    useState<any>(null);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  useEffect(() => {
    getProfile();
  }, []);

  async function handleLogout() {
    await fetch("/auth/signout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <aside className="flex h-full flex-col bg-gradient-to-b from-green-700 to-emerald-600 text-white shadow-2xl">
      {/* HEADER */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <Home size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              SIPERUM
            </h1>

            <p className="text-xs text-green-100">
              Blok B5
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4">
        <p className="mb-3 px-3 text-xs uppercase tracking-wider text-green-100">
          Menu Utama
        </p>

        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            const active =
              pathname === menu.href;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-white text-green-700 shadow-lg"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {menu.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* INFO */}
      <div className="mx-4 mb-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
        <p className="text-xs text-green-100">
          Status Sistem
        </p>

        <p className="mt-1 font-semibold">
          ✅ Online
        </p>

        <p className="mt-2 text-xs text-green-100">
          SIPERUM v1.0
        </p>
      </div>

      {/* USER */}
      <div className="border-t border-white/10 p-4">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white transition hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}