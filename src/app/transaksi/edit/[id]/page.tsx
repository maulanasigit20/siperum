"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

export default function EditPage()  {
  const supabase = createClient();
  const params = useParams();
  const id = params.id;   
  const router = useRouter();

  const [tipe, setTipe] =
    useState("");

  const [kategori, setKategori] =
    useState("");

  const [tanggal, setTanggal] =
  useState("");

  const [nominal, setNominal] =
    useState("");

  const [deskripsi, setDeskripsi] =
    useState("");

  const [lampiran, setLampiran] =
  useState<any[]>([]);

  const [files, setFiles] = useState<
    File[]
    >([]);

  async function getDetail() {
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
      .eq("id", id)
      .single();

    if (data) {
      setTipe(data.tipe);
      setKategori(data.kategori);
      setTanggal(
        data.tanggal_transaksi
        );
      setNominal(
        data.nominal.toString()
      );
      setDeskripsi(data.deskripsi);
      setLampiran(data.transaksi_lampiran || []);
    }
  }

  useEffect(() => {
    getDetail();
  }, []);

  async function handleUpdate() {
    const { error } = await supabase
      .from("transaksi")
      .update({
        tipe,
        kategori,
        tanggal_transaksi: tanggal,
        nominal: Number(nominal),
        deskripsi,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

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

        await supabase
            .from("transaksi_lampiran")
            .insert({
            transaksi_id: id,
            file_url: publicUrl,
            file_path: fileName,
            });
        }

    alert("Berhasil update");

    router.push("/transaksi");
  }

 async function handleDeleteLampiran(
  lampiranId: number
) {
  console.log(
    "DELETE CLICKED:",
    lampiranId
  );

  const confirmDelete = confirm(
    "Hapus lampiran ini?"
  );

  if (!confirmDelete) return;

  const selectedLampiran =
    lampiran.find(
      (item) => item.id === lampiranId
    );

  console.log(
    "SELECTED:",
    selectedLampiran
  );

  if (!selectedLampiran) return;

  console.log(
    "FILE PATH:",
    selectedLampiran.file_path
  );

  const { error: storageError } =
    await supabase.storage
      .from("bukti-transaksi")
      .remove([
        selectedLampiran.file_path,
      ]);

  console.log(
    "STORAGE ERROR:",
    storageError
  );

  if (storageError) {
    alert(storageError.message);
    return;
  }

  const { error } = await supabase
    .from("transaksi_lampiran")
    .delete()
    .eq("id", lampiranId);

  console.log(
    "DB ERROR:",
    error
  );

  if (error) {
    alert(error.message);
    return;
  }

  setLampiran((prev) =>
    prev.filter(
      (item) => item.id !== lampiranId
    )
  );
}

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Edit Transaksi
        </h1>

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
            value={kategori}
            onChange={(e) =>
              setKategori(e.target.value)
            }
            className="w-full rounded border p-3"
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
            value={nominal}
            onChange={(e) =>
              setNominal(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <textarea
            placeholder="Deskripsi"
            value={deskripsi}
            onChange={(e) =>
              setDeskripsi(e.target.value)
            }
            className="w-full rounded border p-3"
          />

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
                    className="h-24 w-full rounded object-cover"
                    />

                    <button
                    type="button"
                    onClick={() =>
                        handleDeleteLampiran(
                        item.id
                        )
                    }
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white"
                    >
                    ✕
                    </button>
                </div>
                ))}
            </div>
          </div>

            <div>
            <p className="mb-3 font-medium">
                Tambah Lampiran Baru
            </p>

            <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="w-full rounded border p-3"
                onChange={(e) => {
                if (e.target.files) {
                    setFiles(
                    Array.from(e.target.files)
                    );
                }
                }}
            />

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
                </div>
            ))}
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full rounded bg-green-600 p-3 text-white"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}