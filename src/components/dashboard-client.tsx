"use client";

import Link from "next/link";

import { useState } from "react";

import FinanceChart from "./finance-chart";

import AppLayout from "./app-layout";

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
    {/* HEADER */}
    <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-8 text-white shadow-xl">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard SIPERUM
        </h1>

        <p className="mt-2 text-green-100">
          Selamat datang, {profile?.nama}
        </p>

        <p className="text-green-100">
          Monitoring Keuangan dan Administrasi Perumahan
        </p>
      </div>

      {/* RIGHT */}
      <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
          
        {/* USER */}
          <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">
                  {profile?.nama?.charAt(0) || "U"}
                </div>

                <div>
                  <p className="font-medium">
                    {profile?.nama || "User"}
                  </p>

                  <p className="text-xs text-green-100">
                    {profile?.role === "admin"
                      ? "Administrator"
                      : profile?.role === "bendahara"
                      ? "Bendahara"
                      : profile?.role === "ketua_rt"
                      ? "Ketua RT"
                      : profile?.role}
                  </p>
                </div>
          </div>
        
      </div>
    </div>
  </div>

        {/* SUMMARY */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-xl">
            <div className="text-4xl">💰</div>

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
            <div className="text-4xl">📈</div>

            <p className="mt-4 text-gray-500">
              Total Pemasukan
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              Rp {totalMasuk.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <div className="text-4xl">📉</div>

            <p className="mt-4 text-gray-500">
              Total Pengeluaran
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-500">
              Rp {totalKeluar.toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white/80 p-5 shadow backdrop-blur-md">
            <div className="text-3xl">🏠</div>

            <h3 className="mt-2 text-2xl font-bold">
              40
            </h3>

            <p className="text-sm text-gray-500">
              Kepala Keluarga
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-5 shadow backdrop-blur-md">
            <div className="text-3xl">👨‍👩‍👧‍👦</div>

            <h3 className="mt-2 text-2xl font-bold">
              80
            </h3>

            <p className="text-sm text-gray-500">
              Warga
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-5 shadow backdrop-blur-md">
            <div className="text-3xl">📢</div>

            <h3 className="mt-2 text-2xl font-bold">
              8
            </h3>

            <p className="text-sm text-gray-500">
              Pengumuman Aktif
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-5 shadow backdrop-blur-md">
            <div className="text-3xl">✅</div>

            <h3 className="mt-2 text-2xl font-bold">
              92%
            </h3>

            <p className="text-sm text-gray-500">
              Pembayaran Lancar
            </p>
          </div>
        </div>

        {/* CHART */}

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
              📊 Grafik Keuangan
              </h2>

              <p className="text-sm text-slate-500">
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

        {/* <div className="mt-8 rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              📊 Grafik Keuangan
            </h2>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              Tahun {selectedYear}
            </span>
          </div>

          <FinanceChart data={monthlyData} />
        </div> */}

        {/* RECENT */}
        <div className="mt-8 rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
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
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
              item.tipe === "masuk"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {item.tipe === "masuk"
              ? "💰"
              : "🧾"}
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