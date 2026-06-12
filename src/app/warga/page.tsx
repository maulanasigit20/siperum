import AppLayout from "@/components/app-layout";

export default function WargaPage() {
  return (
    <AppLayout>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🚧</div>

          <h1 className="text-3xl font-bold">
            Data Warga
          </h1>

          <p className="mt-4 text-gray-500">
            Fitur ini sedang dalam pengembangan.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Nantinya halaman ini digunakan untuk mengelola data warga,
            nomor rumah, status penghuni, dan informasi kontak.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}