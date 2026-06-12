"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppLayout from "@/components/app-layout";
import AddTransactionModal from "@/components/add-transaction-modal";
import EditTransactionModal from "@/components/edit-transaction-modal";
import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function TransaksiPage() {
  const [openModal, setOpenModal] = useState(false);

  const [openEditModal, setOpenEditModal ] = useState(false);

  const [ selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const supabase = createClient();

  const [transaksi, setTransaksi] = useState<any[]>([]);
  
  const [selectedImage, setSelectedImage] = useState("");



  async function getData() {
    const { data } = await supabase
      .from("transaksi")
      .select(`
            *,
            transaksi_lampiran (
                id,
                file_url,
                file_path
            )
            `)
      .order("created_at", { ascending: false });

    setTransaksi(data || []);
  }

  useEffect(() => {
    getData();
  }, []);

async function handleDelete(id: number) {
    const confirmDelete = confirm(
        "Yakin ingin hapus transaksi?"
    );

    if (!confirmDelete) return;

    // ambil semua lampiran
    const { data: lampiranData } =
        await supabase
        .from("transaksi_lampiran")
        .select("*")
        .eq("transaksi_id", id);

    // ambil semua file path
    const filePaths =
        lampiranData
        ?.map(
            (item) => item.file_path
        )
        .filter(Boolean) || [];

    console.log(
        "DELETE FILES:",
        filePaths
    );

    // hapus file storage
    if (filePaths.length > 0) {
        const {
        error: storageError,
        } = await supabase.storage
        .from("bukti-transaksi")
        .remove(filePaths);

        console.log(
        "STORAGE ERROR:",
        storageError
        );

        if (storageError) {
        alert(storageError.message);
        return;
        }
    }

    // hapus transaksi
    const { error } = await supabase
        .from("transaksi")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Transaksi berhasil dihapus");

    getData();
    }


    const [selectedMonth, setSelectedMonth] =
    useState(
        new Date().getMonth() + 1
    );

    const [selectedYear, setSelectedYear] =
    useState(
        new Date().getFullYear()
    );


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

  async function fetchTransaksi() {

  const { data } =
    await supabase
      .from("transaksi")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  setTransaksi(data || []);
}

    useEffect(() => {
    fetchTransaksi();
    }, []);


    const totalMasuk =
      filteredTransaksi
        .filter(
          (t: any) => t.tipe === "masuk"
        )
        .reduce(
          (acc: number, curr: any) =>
            acc + curr.nominal,
          0
        );

    const totalKeluar =
      filteredTransaksi
        .filter(
          (t: any) => t.tipe === "keluar"
        )
        .reduce(
          (acc: number, curr: any) =>
            acc + curr.nominal,
          0
        );

    const saldoPeriode =
      totalMasuk - totalKeluar;

    

  return (
    <AppLayout>
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Transaksi Kas
            </h1>

            <p className="mt-2 text-blue-100">
              Kelola pemasukan dan pengeluaran kas perumahan
            </p>
          </div>

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-600 shadow-lg transition hover:scale-105"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-3xl bg-white/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-semibold text-gray-700">
          📅 Filter Periode
        </span>
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
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-gray-500">
              Jumlah Transaksi
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {filteredTransaksi.length}
            </h3>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-gray-500">
              Pemasukan
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              Rp{" "}
              {filteredTransaksi
                .filter((t) => t.tipe === "masuk")
                .reduce(
                  (a, b) => a + b.nominal,
                  0
                )
                .toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="rounded-3xl bg-white/80 p-5 shadow-lg backdrop-blur-md">
            <p className="text-sm text-gray-500">
              Pengeluaran
            </p>

            <h3 className="mt-2 text-3xl font-bold text-red-500">
              Rp{" "}
              {filteredTransaksi
                .filter(
                  (t) => t.tipe === "keluar"
                )
                .reduce(
                  (a, b) => a + b.nominal,
                  0
                )
                .toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-lg">
  <p className="text-sm opacity-80">
    Saldo Periode Ini
  </p>

  <h3 className="mt-2 text-3xl font-bold">
    Rp{" "}
    {saldoPeriode.toLocaleString(
      "id-ID"
    )}
  </h3>
</div>
        </div>
      </div>
    </div>

      <div className="overflow-hidden rounded-3xl bg-white/80 shadow-xl backdrop-blur-md">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Tipe</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Nominal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Deskripsi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Bukti</th>
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Aksi</th>
              
            </tr>
          </thead>

          <tbody>
            {filteredTransaksi.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="p-4">
                  <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
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

                <td className="p-4">
                    {new Date(
                        item.tanggal_transaksi
                    ).toLocaleDateString("id-ID")}
                    </td>

                <td className="p-4">
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

                <td className="p-4">
                    <div className="flex gap-2">
                        {item.transaksi_lampiran &&
                        item.transaksi_lampiran.length >
                        0 ? (
                        item.transaksi_lampiran.map(
                            (lampiran: any) => (
                            <img
                                key={lampiran.id}
                                src={lampiran.file_url}
                                alt="Lampiran"
                                onClick={() =>
                                setSelectedImage(
                                    lampiran.file_url
                                )
                                }
                                className="
                                h-20
                                w-20
                                rounded-2xl
                                object-cover
                                shadow-md
                                cursor-pointer
                                transition
                                hover:scale-110
                                "
                            />
                            )
                        )
                        ) : (
                        <span>-</span>
                        )}
                    </div>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTransaction(item);
                          setOpenEditModal(true);
                        }}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-white"
                      >
                      <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="
                        rounded-xl
                        bg-red-100
                        p-2
                        text-red-600
                        hover:bg-red-200
                      "
                      >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
              
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage("")}
        >
          <div className="relative max-w-4xl">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[90vh] rounded-xl"
            />

            <button
              onClick={() =>
                setSelectedImage("")
              }
              className="absolute right-2 top-2 rounded bg-white px-3 py-1 text-black"
            >
              X
            </button>
          </div>
        </div>
      )}

      <AddTransactionModal
        open={openModal}
        onClose={() =>
            setOpenModal(false)
        }
        onSuccess={fetchTransaksi}
        />

      <EditTransactionModal
        open={openEditModal}
        transaction={selectedTransaction}
        onClose={() =>
          setOpenEditModal(false)
        }
        onSuccess={fetchTransaksi}
      />
    </AppLayout>
  );
}