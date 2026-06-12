import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // profile
  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  // transaksi
  const { data: transaksi } =
    await supabase
      .from("transaksi")
      .select("*")
      .order(
        "tanggal_transaksi",
        {
          ascending: false,
        }
      );

  return (
    <DashboardClient
      user={user}
      profile={profile}
      transaksi={transaksi || []}
    />
  );
}