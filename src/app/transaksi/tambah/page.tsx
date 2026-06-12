"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TambahTransaksiPage() {
  const supabase = createClient();
  const router = useRouter();

  const [tipe, setTipe] = useState("masuk");
  const [kategori, setKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState("");
  const [tanggal, setTanggal] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. insert transaksi dulu
    const { data: transaksiData, error } =
      await supabase
        .from("transaksi")
        .insert({
          tipe,
          kategori,
          tanggal_transaksi: tanggal,
          nominal: Number(nominal),
          deskripsi,
          created_by: user?.id,
        })
        .select()
        .single();

    if (error) {
      alert(error.message);
      return;
    }

    // 2. upload semua file
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("bukti-transaksi")
          .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("bukti-transaksi")
        .getPublicUrl(fileName);

      // simpan lampiran
      await supabase
        .from("transaksi_lampiran")
        .insert({
          transaksi_id: transaksiData.id,
          file_url: publicUrl,
          file_path: fileName,
        });
    }

    alert("Transaksi berhasil ditambahkan");

    router.push("/transaksi");
  }

  function removeFile(index: number) {
    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  return (
    <AppLayout>
      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">
          Tambah Transaksi
        </h1>

        <p className="mt-2 text-green-100">
          Catat pemasukan dan pengeluaran kas perumahan
        </p>
      </div>

        <div className="space-y-4">
          <select
            value={tipe}
            onChange={(e) =>
              setTipe(e.target.value)
            }
            className="w-full rounded border p-3"
          >
            <option value="masuk">
              Kas Masuk
            </option>

            <option value="keluar">
              Kas Keluar
            </option>
          </select>

          <input
            type="text"
            placeholder="Kategori"
            className="w-full rounded border p-3"
            onChange={(e) =>
              setKategori(e.target.value)
            }
          />

          <input
            type="date"
            value={tanggal}
            onChange={(e) =>
              setTanggal(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <input
            type="number"
            placeholder="Nominal"
            className="w-full rounded border p-3"
            onChange={(e) =>
              setNominal(e.target.value)
            }
          />

          <textarea
            placeholder="Deskripsi"
            className="w-full rounded border p-3"
            onChange={(e) =>
              setDeskripsi(e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="cameraInput"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];

              if (selectedFile) {
                setFiles((prev) => [
                  ...prev,
                  selectedFile,
                ]);
              }

              // reset input supaya bisa upload file sama lagi
              e.target.value = "";
            }}
          />

          <div> 
            <label
            htmlFor="cameraInput"
            className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white"
          >
            Tambah Foto
          </label>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {files.length} foto dipilih
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-24 w-full rounded object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded bg-green-600 p-3 text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </AppLayout>
  );
}