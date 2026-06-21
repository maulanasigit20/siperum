"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Wallet,
  Camera,
  Users,
  FileText,
} from "lucide-react";

interface Props {
  onAddTransaction: () => void;
}

export default function BottomNavigation({
  onAddTransaction,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="relative
    flex
    h-20
    items-center
    justify-around
    
    bg-white
    shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
    rounded-t-3xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex
                            flex-col
                            items-center
                            text-xs
                            w-16 ${
            pathname === "/dashboard"
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <Home size={22} />
          <span>Home</span>
        </Link>

        {/* Transaksi */}
        <Link
          href="/transaksi"
          className={`flex
                        flex-col
                        items-center
                        text-xs
                        w-16 ${
            pathname === "/transaksi"
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <Wallet size={22} />
          <span>Kas</span>
        </Link>

        {/* BUTTON TENGAH */}
        <div
            className="
                absolute
                left-1/2
                -top-10
                -translate-x-1/2
            "
            >
            {/* LINGKARAN PUTIH */}
            <div
                className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                "
            >
                <button
                onClick={onAddTransaction}
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-green-600
                    to-emerald-500
                    text-white
                    shadow-lg
                    transition
                    active:scale-95
                "
                >
                <Camera size={30} />
                </button>
            </div>
            </div>

        {/* Warga */}
        <Link
          href="/warga"
          className={`flex
                        flex-col
                        items-center
                        text-xs
                        w-16 ${
            pathname === "/warga"
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <Users size={22} />
          <span>Warga</span>
        </Link>

        {/* Laporan */}
        <Link
          href="/laporan"
          className={`flex
                        flex-col
                        items-center
                        text-xs
                        w-16 ${
            pathname === "/laporan"
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <FileText size={22} />
          <span>Laporan</span>
        </Link>
      </div>
    </div>
  );
}