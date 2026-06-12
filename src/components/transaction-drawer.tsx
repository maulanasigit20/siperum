"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TransactionDrawer({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">
            Tambah Transaksi
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* TIPE */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Jenis
            </label>

            <select className="w-full rounded-xl border p-3">
              <option value="masuk">
                Pemasukan
              </option>

              <option value="keluar">
                Pengeluaran
              </option>
            </select>
          </div>

          {/* KATEGORI */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Kategori
            </label>

            <input
              type="text"
              placeholder="Contoh: Kerja Bakti"
              className="w-full rounded-xl border p-3"
            />
          </div>

          {/* NOMINAL */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nominal
            </label>

            <input
              type="number"
              placeholder="100000"
              className="w-full rounded-xl border p-3"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Deskripsi
            </label>

            <textarea
              rows={4}
              placeholder="Masukkan deskripsi"
              className="w-full rounded-xl border p-3"
            />
          </div>

          {/* UPLOAD */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Bukti Transaksi
            </label>

            <input
              type="file"
              multiple
              className="w-full rounded-xl border p-3"
            />
          </div>

          {/* BUTTON */}
          <button className="w-full rounded-xl bg-green-600 p-3 font-medium text-white">
            Simpan Transaksi
          </button>
        </div>
      </div>
    </>
  );
}