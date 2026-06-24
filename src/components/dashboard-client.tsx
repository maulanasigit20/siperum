"use client";

import Link from "next/link";

import { useState } from "react";

import FinanceChart from "./finance-chart";

import AppLayout from "./app-layout";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Home,
  Users,
  Bell,
  BadgeCheck,
  Receipt,
} from "lucide-react";

export default function DashboardClient({
  user,
  profile,
  transaksi,
}: any) {
  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().getMonth() + 1
    );

  const [selectedYear, setSelectedYear] =
    useState(
      new Date().getFullYear()
    );

  // filter transaksi
  const filteredTransaksi =
    transaksi.filter((item: any) => {
      const date = new Date(
        item.tanggal_transaksi
      );

      return (
        date.getMonth() + 1 ===
          selectedMonth &&
        date.getFullYear() ===
          selectedYear
      );
    });

  // hitung summary
  const totalMasuk =
    transaksi
      .filter(
        (t: any) =>
          t.tipe === "masuk"
      ) 
      .reduce(
        (acc: number, curr: any) =>
          acc + curr.nominal,
        0
      );

  const totalKeluar =
    transaksi
      .filter(
        (t: any) =>
          t.tipe === "keluar"
      )
      .reduce(
        (acc: number, curr: any) =>
          acc + curr.nominal,
        0
      );

  const saldo =
    totalMasuk - totalKeluar;

  const chartTransaksi =
  transaksi.filter((item: any) => {
    const date = new Date(
      item.tanggal_transaksi
    );

    return (
      date.getFullYear() ===
      selectedYear
    );
  });

  const recentTransaksi = [...transaksi]
  .sort(
    (a: any, b: any) =>
      new Date(b.tanggal_transaksi).getTime() -
      new Date(a.tanggal_transaksi).getTime()
  )
  .slice(0, 5);

  // chart bulanan
  const monthlyDataMap: Record<
  string,
  {
    bulan: string;
    saldo: number;
    masuk: number;
    keluar: number;
  }
> = {};

chartTransaksi?.forEach((item: any) => {
  const date = new Date(
    item.tanggal_transaksi
  );

  const bulan = date.toLocaleString(
    "id-ID",
    {
      month: "short",
    }
  );

  if (!monthlyDataMap[bulan]) {
    monthlyDataMap[bulan] = {
      bulan,
      saldo: 0,
      masuk: 0,
      keluar: 0,
    };
  }

  if (item.tipe === "masuk") {
    monthlyDataMap[bulan].masuk +=
      item.nominal;

    monthlyDataMap[bulan].saldo +=
      item.nominal;
  } else {
    monthlyDataMap[bulan].keluar +=
      item.nominal;

    monthlyDataMap[bulan].saldo -=
      item.nominal;
  }
});

 const monthlyData = Object.values(
  monthlyDataMap
    ).sort((a, b) => {
    const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ];

    return (
        monthOrder.indexOf(a.bulan) -
        monthOrder.indexOf(b.bulan)
    );
    });

  return (
    <AppLayout>
      <div className="lg:hidden" />
      {/* MOBILE HEADER */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Image
              src="images/logo-siperum.svg"
              alt="Siperum"
              width={140}
              height={40}
              priority
            />

            {/* RIGHT */}
            <div className="flex items-center gap-3 mr-4">

              {/* NOTIF */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">

                <Bell
                  size={20}
                  className="text-slate-700"
                />

                {/* Badge */}
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* PROFILE */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 font-bold text-white shadow">

                {profile?.nama?.charAt(0)}
              </div>

            </div>
          </div>

          {/* GREETING MOBILE*/}
          <div className="pl-5 pb-5">
            <h1 className="text-2xl text-white">
              Hi! {profile?.nama}
            </h1>
          </div>
        </div>

      {/* DESKTOP HEADER */}
      <div className="mb-8 hidden overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-8 text-white shadow-xl lg:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Dashboard SIPERUM
            </h1>

            <p className="mt-2 text-green-100">
              Selamat datang, {profile?.nama}
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE SWIPE CARD */}
      <div className="lg:hidden">
        <Swiper
        // slidesPerView={1.15}
        // centeredSlides
        // spaceBetween={15}

        modules={[Pagination, Autoplay]}
        slidesPerView={1.15}
        centeredSlides
        spaceBetween={16}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}

      >
          <SwiperSlide>
            <div className=" overflow-hidden rounded-[32px] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-6 text-white shadow-xl">
              <p className="text-sm text-green-100">
                Total Saldo Kas
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Rp {saldo.toLocaleString("id-ID")}
              </h2>

              <div className="mt-6 flex gap-2">
                <div className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
                  Kas
                </div>

                <div className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
                  Warga
                </div>

                <div className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
                  Laporan
                </div>
              </div>
            </div>
          </SwiperSlide>

          

          <SwiperSlide>
            <div className=" overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 to-cyan-500 p-6 text-white shadow-xl">
              <p className="text-sm opacity-80">
                Total Pemasukan
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Rp {totalMasuk.toLocaleString("id-ID")}
              </h2>

              <p className="mt-6 text-sm opacity-80">
                Seluruh pemasukan kas warga
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
              <div className=" overflow-hidden rounded-[32px] bg-gradient-to-br from-red-600 to-rose-500 p-6 text-white shadow-xl">
                <p className="text-sm opacity-80">
                  Total Pengeluaran
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Rp {totalKeluar.toLocaleString("id-ID")}
                </h2>

                <p className="mt-6 text-sm opacity-80">
                  Seluruh pengeluaran kas warga
                </p>
              </div>
            </SwiperSlide>
        </Swiper>
      </div>

      <div
          className="lg:hidden
            mt-3
            rounded-t-[40px]
            bg-white
            px-5
            pt-6
            pb-28
            shadow-2xl
          "
        > 

            {/* QUICK MENU MOBILE */}
        <div className="rounded-3xl bg-white p-5 shadow-lg lg:hidden">
          <h2 className="mb-4 font-bold text-slate-800">
            Menu Cepat
          </h2>

          <div className="grid grid-cols-4 gap-3">
            <Link
              href="/warga"
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                🏠
              </div>

              <p className="mt-2 text-center text-xs">
                Warga
              </p>
            </Link>

            <Link
              href="/transaksi"
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                💰
              </div>

              <p className="mt-2 text-center text-xs">
                Kas
              </p>
            </Link>

            <Link
              href="/laporan"
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                📊
              </div>

              <p className="mt-2 text-center text-xs">
                Laporan
              </p>
            </Link>

            <button
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                📢
              </div>

              <p className="mt-2 text-center text-xs">
                Info
              </p>
            </button>
          </div>
        </div>

      {/* RECENT MOBILE */}
        <div className="lg:hidden mt-6 rounded-3xl bg-white p-5 shadow-lg">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Transaksi Terbaru
            </h2>

            <Link
              href="/transaksi"
              className="text-sm font-medium text-green-600"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-1">
            {transaksi
              .slice(0, 3)
              .map((item: any, index: number) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between py-3">
                    
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          item.tipe === "masuk"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <div
                          className={`h-3 w-3 rounded-full ${
                            item.tipe === "masuk"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {item.kategori}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            item.tanggal_transaksi
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          item.tipe === "masuk"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.tipe === "masuk"
                          ? "+"
                          : "-"}
                        Rp{" "}
                        {item.nominal.toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </div>

                  {index !== 2 && (
                    <div className="border-b border-slate-100" />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* STATISTIK MOBILE */}
        <div className="lg:hidden mt-6 rounded-3xl bg-white p-5 shadow-lg grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Home size={26} />

            <h3 className="mt-2 text-1xl font-bold">
              40
            </h3>

            <p className="text-sm text-gray-500">
              Kepala Keluarga
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Users size={26} />

            <h3 className="mt-2 text-1xl font-bold">
              80
            </h3>

            <p className="text-sm text-gray-500">
              Warga
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Bell size={26} />

            <h3 className="mt-2 text-1xl font-bold">
              8
            </h3>

            <p className="text-sm text-gray-500">
              Pengumuman Aktif
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <BadgeCheck size={26} />

            <h3 className="mt-2 text-1xl font-bold">
              92%
            </h3>

            <p className="text-sm text-gray-500">
              Pembayaran Lancar
            </p>
          </div>
        </div>


        {/* CHART MOBILE */}

        <div className="lg:hidden mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
              📊 Grafik Keuangan
              </h2>

              <p className="text-xs text-slate-500">
                Tren pemasukan dan pengeluaran
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(e.target.value)
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                {[2025, 2026, 2027].map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <FinanceChart data={monthlyData} />
        </div>

        </div>



      {/* SALDO KAS */}
      <div className="hidden gap-5 md:grid-cols-3 lg:grid">
          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-xl">
            <Wallet size={36} />

            <p className="mt-4 text-sm opacity-80">
              Saldo Kas
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Rp {saldo.toLocaleString("id-ID")}
            </h2>

            <p className="text-xs mt-2 text-green-100 opacity-80">
              Update hari ini
            </p>
          </div>

          <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <TrendingUp
                size={36}
                className="text-green-600"
              />

            <p className="mt-4 text-gray-500">
              Total Pemasukan
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              Rp {totalMasuk.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <TrendingDown
              size={36}
              className="text-red-500"
            />

            <p className="mt-4 text-gray-500">
              Total Pengeluaran
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-500">
              Rp {totalKeluar.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>


        {/* STATISTIK */}
        <div className="hidden lg:grid mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Home size={26} />

            <h3 className="mt-2 text-2xl font-bold">
              40
            </h3>

            <p className="text-sm text-gray-500">
              Kepala Keluarga
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Users size={26} />

            <h3 className="mt-2 text-2xl font-bold">
              80
            </h3>

            <p className="text-sm text-gray-500">
              Warga
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Bell size={26} />

            <h3 className="mt-2 text-2xl font-bold">
              8
            </h3>

            <p className="text-sm text-gray-500">
              Pengumuman Aktif
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <BadgeCheck size={26} />

            <h3 className="mt-2 text-2xl font-bold">
              92%
            </h3>

            <p className="text-sm text-gray-500">
              Pembayaran Lancar
            </p>
          </div>
        </div>

        {/* CHART */}

        <div className="hidden mt-6 rounded-3xl bg-white p-5 shadow-sm lg:grid">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
              📊 Grafik Keuangan
              </h2>

              <p className="text-xs text-slate-500">
                Tren pemasukan dan pengeluaran
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    Number(e.target.value)
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                {[2025, 2026, 2027].map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <FinanceChart data={monthlyData} />
        </div>


        {/* RECENT DESKTOP*/}
        <div className="hidden lg:grid mt-8 rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            🧾 Transaksi Terbaru
          </h2>

          <Link
            href="/transaksi"
            className="text-sm font-medium text-green-600"
          >
            Lihat Semua
          </Link>
        </div>

    <div className="space-y-3">
    {recentTransaksi.map((item: any) => (
      <div
        key={item.id}
        className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                item.tipe === "masuk"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {item.tipe === "masuk" ? (
                <TrendingUp
                  size={20}
                  className="text-green-600"
                />
              ) : (
                <Receipt
                  size={20}
                  className="text-red-500"
                />
              )}
            </div>

          <div>
            <p className="font-semibold">
              {item.kategori}
            </p>

            <p className="text-sm text-gray-500">
              {item.deskripsi}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {new Date(
                item.tanggal_transaksi
              ).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              item.tipe === "masuk"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {item.tipe === "masuk"
              ? "+"
              : "-"}
            Rp{" "}
            {item.nominal.toLocaleString(
              "id-ID"
            )}
          </p>
        </div>
      </div>
    ))}

    {recentTransaksi.length === 0 && (
      <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
        Belum ada transaksi
      </div>
    )}
  </div>
  </div>
    </AppLayout>
  );
}