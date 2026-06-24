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
      <main
        className="
          
          lg:ml-[280px]
          lg:p-8
          lg:pb-8

          bg-gradient-to-b
          from-[#1a0070]
          via-[#0dff00]
          to-[#00d000]

          lg:bg-none
          lg:bg-slate-100
        "
      >
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