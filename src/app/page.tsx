import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-green-700">
          SIPERUM
        </h1>

        <p className="mb-6 text-center text-gray-600">
          Sistem Informasi Pengelolaan Perumahan
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block rounded-lg bg-green-600 px-4 py-3 text-center font-medium text-white transition hover:bg-green-700"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="block rounded-lg border border-gray-300 px-4 py-3 text-center font-medium transition hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}