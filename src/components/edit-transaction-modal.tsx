"use client";

import { createClient } from "@/lib/supabase/client";

import { useState, useEffect, } from "react";

import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  transaction: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTransactionModal({
  open,
  transaction,
  onClose,
  onSuccess,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [tipe, setTipe] =
    useState("masuk");

  const [kategori, setKategori] =
    useState("");

  const [nominal, setNominal] =
    useState("");

  const [deskripsi, setDeskripsi] =
    useState("");

  const [files, setFiles] = useState<
    File[]
  >([]);

  const [lampiran, setLampiran] =
  useState<any[]>([]);

  const [tanggal, setTanggal] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

useEffect(() => {
  if (!transaction) return;

  setTipe(transaction.tipe || "");

  setKategori(
    transaction.kategori || ""
  );

  setTanggal(
    transaction.tanggal_transaksi || ""
  );

  setNominal(
    transaction.nominal?.toString() ||
      ""
  );

  setDeskripsi(
    transaction.deskripsi || ""
  );

  setLampiran(
    transaction.transaksi_lampiran ||
      []
  );
}, [transaction]);

  if (!open) return null;

  async function handleSubmit() {
    try {
        setLoading(true);

        const { error } =
        await supabase
            .from("transaksi")
            .update({
            tipe,
            kategori,
            tanggal_transaksi:
                tanggal,
            nominal: Number(nominal),
            deskripsi,
            })
            .eq(
            "id",
            transaction.id
            );

        if (error) {
        alert(error.message);
        return;
        }

        for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;

        const {
            error: uploadError,
        } = await supabase.storage
            .from("bukti-transaksi")
            .upload(fileName, file);

        if (uploadError) continue;

        const {
            data: { publicUrl },
        } = supabase.storage
            .from("bukti-transaksi")
            .getPublicUrl(fileName);

        await supabase
            .from("transaksi_lampiran")
            .insert({
            transaksi_id:
                transaction.id,
            file_url: publicUrl,
            file_path: fileName,
            });
        }

        onSuccess();
        onClose();
    } finally {
        setLoading(false);
    }
    }

  function removeFile(index: number) {
    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  async function handleDeleteLampiran(
    lampiranId: number
    ) {
    const selectedLampiran =
        lampiran.find(
        (item) =>
            item.id === lampiranId
        );

    if (!selectedLampiran) return;

    await supabase.storage
        .from("bukti-transaksi")
        .remove([
        selectedLampiran.file_path,
        ]);

    await supabase
        .from("transaksi_lampiran")
        .delete()
        .eq("id", lampiranId);

    setLampiran((prev) =>
        prev.filter(
        (item) =>
            item.id !== lampiranId
        )
    );
    }

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* MODAL */}
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
          <div>
            <h2 className="text-2xl font-bold">
              Tambah Transaksi
            </h2>

            <p className="text-sm text-green-100">
              Catat pemasukan dan pengeluaran kas warga
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-5 p-6">
          {/* TIPE */}
          <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTipe("masuk")}
            className={`rounded-2xl p-4 font-medium transition ${
              tipe === "masuk"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-slate-100"
            }`}
          >
            📈 Kas Masuk
          </button>

          <button
            type="button"
            onClick={() => setTipe("keluar")}
            className={`rounded-2xl p-4 font-medium transition ${
              tipe === "keluar"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-slate-100"
            }`}
          >
            📉 Kas Keluar
          </button>
        </div>

          {/* KATEGORI */}
          <input
            type="text"
            placeholder="Kategori"
            value={kategori}
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setKategori(e.target.value)
            }
          />

          {/* TANGGAL & NOMINAL */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={tanggal}
              onChange={(e) =>
                setTanggal(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

            <input
              type="number"
              placeholder="Nominal"
              value={nominal}
              onChange={(e) =>
                setNominal(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          {/* DESKRIPSI */}
          <textarea
            placeholder="Deskripsi"
            value={deskripsi}
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setDeskripsi(
                e.target.value
              )
            }
          />

          {/* PREVIEW INPUTAN */}
          <div
            className={`rounded-2xl border p-4 ${
                tipe === "masuk"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
            >
            <p className="mb-3 text-sm font-medium text-gray-500">
                Preview Transaksi
            </p>

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                <p className="font-semibold text-slate-800">
                    {kategori || "Kategori"}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                    {deskripsi || "Deskripsi transaksi"}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                    {tanggal}
                </p>
                </div>

                <p
                className={`text-2xl font-bold ${
                    tipe === "masuk"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
                >
                {tipe === "masuk" ? "+" : "-"}
                Rp{" "}
                {Number(
                    nominal || 0
                ).toLocaleString("id-ID")}
                </p>
            </div>
            </div>

            <div>
                <p className="mb-3 font-medium">
                    Lampiran Saat Ini
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {lampiran.map((item) => (
                    <div
                        key={item.id}
                        className="relative"
                    >
                        <img
                        src={item.file_url}
                        alt="Lampiran"
                        className="h-24 w-full rounded-xl object-cover"
                        />

                        <button
                        type="button"
                        onClick={() =>
                            handleDeleteLampiran(
                            item.id
                            )
                        }
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                        ✕
                        </button>
                    </div>
                    ))}
                </div>
                </div>  

          {/* CAMERA */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="cameraInput"
            multiple
            onChange={(e) => {
              const selectedFiles =
                Array.from(
                  e.target.files || []
                );

              if (
                selectedFiles.length > 0
              ) {
                setFiles((prev) => [
                  ...prev,
                  ...selectedFiles,
                ]);
              }

              e.target.value = "";
            }}
          />

          <div>
            <label
                htmlFor="cameraInput"
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-green-300
                  p-8
                  text-center
                  transition
                  hover:bg-green-50
                "
              >
                <div className="text-4xl">
                  📷
                </div>

                <p className="mt-2 font-medium">
                  Upload Bukti Transaksi
                </p>

                <p className="text-sm text-gray-500">
                  Klik untuk memilih foto
                </p>
              </label>
          </div>

          <p className="text-sm text-gray-500">
            {files.length} foto dipilih
          </p>

          {/* PREVIEW Lampiran */}
          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative"
              >
                <img
                  src={URL.createObjectURL(
                    file
                  )}
                  alt="Preview"
                  className="h-24 w-full rounded-xl object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeFile(index)
                  }
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Batal
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-green-600 px-6 py-3 font-medium text-white"
          >
            {loading
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>
        </div>
      </div>
    </>
  );
}