import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavbarMobile from "../components/NavbarMobile.jsx";

export default function MobileLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-neutral-50 pb-16">
      <header className="sticky top-0 z-20 bg-neutral-50/90 px-4 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            OrderGo
          </h1>
          <p className="text-xs text-slate-500">
            Temukan produk favoritmu di sini
          </p>
        </div>
        <div className="mt-3">
          <input
            type="search"
            placeholder="Cari produk, kategori, atau brand"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </header>
      <main className="flex-1 space-y-4 px-4 py-4">
        <Outlet context={{ searchTerm, setSearchTerm }} />
      </main>
      <NavbarMobile />
    </div>
  );
}
