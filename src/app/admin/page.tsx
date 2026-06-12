import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // kalau bukan admin
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-red-600">
        Admin Panel
      </h1>

      <p className="mt-4">
        Halaman ini hanya untuk admin.
      </p>
    </div>
  );
}