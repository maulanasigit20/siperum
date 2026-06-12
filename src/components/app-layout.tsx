import Sidebar from "./sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <div className="fixed left-0 top-0 h-screen w-[280px]">
        <Sidebar />
      </div>

      <main className="ml-[280px] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}