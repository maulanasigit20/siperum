"use client";

import { useState } from "react";

import Sidebar from "./sidebar";
import BottomNavigation from "./bottom-navigation";

import AddTransactionModal from "./add-transaction-modal";



import {
  Bell,
  Menu,
  X,
} from "lucide-react";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [openModal, setOpenModal] =
  useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 h-screen w-[280px]">
          <Sidebar />
        </div>
      </div>

      {/* CONTENT */}
      <main className="pb-28 p-4 lg:ml-[280px] lg:p-8 lg:pb-8">
        {children}
      </main>

      <BottomNavigation
        onAddTransaction={() =>
          setOpenModal(true)
        }
      />

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() =>
          window.location.reload()
        }
      />
      
    </div>
  );
}