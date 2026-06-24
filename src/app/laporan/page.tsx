"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/app-layout";
import { createClient } from "@/lib/supabase/client";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Transaksi {
  id: number;
  created_at: string;
  tipe: string;
  kategori: string;
  nominal: number;
  deskripsi: string;
  tanggal_transaksi: string;
}

export default function LaporanPage() {
  const supabase = createClient();

  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [search, setSearch] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
    );

    const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
    );

  useEffect(() => {
    fetchTransaksi();
  }, []);

  async function fetchTransaksi() {
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .order("tanggal_transaksi", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setTransaksi(data || []);
  }

  const filteredTransaksi = useMemo(() => {
    return transaksi.filter((item) => {

        const date = new Date(
        item.tanggal_transaksi
        );

        const matchMonth =
        date.getMonth() + 1 === selectedMonth;

        const matchYear =
        date.getFullYear() === selectedYear;

        const keyword = search.toLowerCase();

        const matchSearch =
        item.kategori
            ?.toLowerCase()
            .includes(keyword) ||
        item.deskripsi
            ?.toLowerCase()
            .includes(keyword);

        return (
        matchMonth &&
        matchYear &&
        matchSearch
        );
    });
    }, [
    transaksi,
    search,
    selectedMonth,
    selectedYear,
    ]);

  const totalMasuk = filteredTransaksi
    .filter((t) => t.tipe === "masuk")
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  const totalKeluar = filteredTransaksi
    .filter((t) => t.tipe === "keluar")
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  const saldo = totalMasuk - totalKeluar;

  const bulanIndonesia = [
    "",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function exportExcel() {
    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredTransaksi
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Laporan"
    );

    XLSX.writeFile(
      workbook,
      `laporan_kas-${selectedMonth}-${selectedYear}.xlsx`
    );
  }

  function exportPDF() {
    const doc = new jsPDF();

    const periode =
      `${bulanIndonesia[selectedMonth]} ${selectedYear}`;

    const totalMasuk = filteredTransaksi
      .filter((t) => t.tipe === "masuk")
      .reduce((sum, t) => sum + Number(t.nominal), 0);

    const totalKeluar = filteredTransaksi
      .filter((t) => t.tipe === "keluar")
      .reduce((sum, t) => sum + Number(t.nominal), 0);

    const saldo = totalMasuk - totalKeluar;

    // =====================
    // HEADER
    // =====================

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
      "LAPORAN KEUANGAN PURI LIVING",
      105,
      20,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Periode ${periode}`,
      105,
      28,
      { align: "center" }
    );

    doc.line(14, 35, 196, 35);

    // =====================
    // RINGKASAN
    // =====================

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(
      "RINGKASAN KEUANGAN",
      14,
      45
    );

    autoTable(doc, {
      startY: 50,

      theme: "grid",

      head: [
        [
          "Total Masuk",
          "Total Keluar",
        ],
      ],

      body: [
        [
          `Rp ${totalMasuk.toLocaleString(
            "id-ID"
          )}`,
          `Rp ${totalKeluar.toLocaleString(
            "id-ID"
          )}`,
        ],
      ],
    });

    const firstTableEnd =
      (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: firstTableEnd + 5,

      theme: "grid",

      head: [
        [
          "Saldo Akhir",
          "Jumlah Transaksi",
        ],
      ],

      body: [
        [
          `Rp ${saldo.toLocaleString(
            "id-ID"
          )}`,
          filteredTransaksi.length.toString(),
        ],
      ],
    });

    const summaryEnd =
      (doc as any).lastAutoTable.finalY + 10;

    // =====================
    // DETAIL TRANSAKSI
    // =====================

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    doc.text(
      "DETAIL TRANSAKSI",
      14,
      summaryEnd
    );

    autoTable(doc, {
      startY: summaryEnd + 5,

      head: [[
        "Tanggal",
        "Tipe",
        "Kategori",
        "Nominal",
        "Deskripsi",
      ]],

      body: filteredTransaksi.map(
        (item) => [
          new Date(
            item.tanggal_transaksi
          ).toLocaleDateString("id-ID"),

          item.tipe === "masuk"
            ? "Masuk"
            : "Keluar",

          item.kategori,

          `Rp ${Number(
            item.nominal
          ).toLocaleString("id-ID")}`,

          item.deskripsi || "-",
        ]
      ),

      styles: {
        fontSize: 9,
      },

      headStyles: {
        fillColor: [71, 85, 105],
      },
    });

    // =====================
    // FOOTER
    // =====================

    const finalY =
      (doc as any).lastAutoTable.finalY + 25;

    doc.line(
      14,
      finalY - 10,
      196,
      finalY - 10
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Dicetak pada ${new Date().toLocaleString(
        "id-ID"
      )}`,
      14,
      finalY
    );

    // =====================
    // TANDA TANGAN
    // =====================

    doc.setFontSize(11);

    doc.text(
      "Mengetahui,",
      14,
      finalY + 20
    );

    doc.text(
      "Bendahara",
      30,
      finalY + 35
    );

    doc.text(
      "Ketua Row",
      140,
      finalY + 35
    );

    doc.line(
      20,
      finalY + 65,
      70,
      finalY + 65
    );

    doc.line(
      130,
      finalY + 65,
      180,
      finalY + 65
    );

    doc.save(
      `Laporan-Keuangan-${periode}.pdf`
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Laporan Keuangan
            </h1>

            <p className="mt-2 text-blue-100">
              Laporan pemasukan dan pengeluaran kas perumahan
            </p>
          </div>
        </div>
        </div>

        {/* Summary */}

        <div className="mb-6 grid gap-4 md:grid-cols-4">

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-slate-500">
              Total Masuk
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              Rp {totalMasuk.toLocaleString("id-ID")}
            </h2>
          </div >

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-slate-500">
              Total Keluar
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              Rp {totalKeluar.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-slate-500">
              Saldo
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-600">
              Rp {saldo.toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-slate-500">
              Jumlah Transaksi
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {filteredTransaksi.length}
            </h2>
          </div>

        </div>

        {/* Search */}

        <div className="rounded-3xl bg-white p-4 shadow-lg">
          <input
            type="text"
            placeholder="Cari berdasarkan kategori dan deskripsi..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-white/80 bg-black/2 p-3 text-gray placeholder:text-gray/60 outline-none backdrop-blur-md"
          />
        </div>


      <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">

        <div className="flex gap-2">
            {/* BULAN */}
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                Number(e.target.value)
              )
            }
            className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2
            shadow-sm
            outline-none
            focus:border-blue-500
            "
          >
            {Array.from(
              { length: 12 },
              (_, i) => (
                <option
                  key={i}
                  value={i + 1}
                  className="text-black"
                >
                  {new Date(
                    0,
                    i
                  ).toLocaleString(
                    "id-ID",
                    {
                      month: "long",
                    }
                  )}
                </option>
              )
            )}
          </select>

          {/* TAHUN */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                Number(e.target.value)
              )
            }
            className="
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2
            shadow-sm
            outline-none
            focus:border-blue-500
            "
          >
            {[2025, 2026, 2027].map(
              (year) => (
                <option
                  key={year}
                  value={year}
                  className="text-black"
                >
                  {year}
                </option>
              )
            )}
          </select>
          </div>

        <button
          onClick={exportExcel}
          className="rounded-xl bg-green-600 px-4 py-2 text-white"
        >
          Export Excel
        </button>

        <button
          onClick={exportPDF}
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >
          Cetak Laporan
        </button>

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-3xl bg-white/80 shadow-xl backdrop-blur-md">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Tanggal
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Tipe
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Kategori
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Nominal
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Deskripsi
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredTransaksi.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    {new Date(
                      item.tanggal_transaksi
                    ).toLocaleDateString("id-ID")}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.tipe === "masuk"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.tipe === "masuk"
                        ? "↗ Masuk"
                        : "↘ Keluar"}
                    </span>
                  </td>

                  <td className="p-4">
                    {item.kategori}
                  </td>

                  <td className="p-4 font-semibold">
                    <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                      item.tipe === "masuk"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.tipe === "masuk"
                      ? "+"
                      : "-"}{" "}
                    Rp{" "}
                    {item.nominal.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                  </td>

                  <td className="max-w-md p-4 text-sm text-slate-600">
                    {item.deskripsi}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AppLayout>
  );
}