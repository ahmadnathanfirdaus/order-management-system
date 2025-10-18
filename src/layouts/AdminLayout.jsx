import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin.jsx";

export default function AdminLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="hidden shrink-0 border-r border-slate-200 bg-white lg:block lg:w-64">
        <SidebarAdmin />
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Order Management
            </h2>
            <p className="text-sm text-slate-500">
              Pantau katalog dan orders secara cepat
            </p>
          </div>
          <div className="flex items-center gap-3">
            <form
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm md:flex"
              onSubmit={(event) => event.preventDefault()}
              role="search"
            >
              <span aria-hidden="true" className="text-slate-400">
                🔍
              </span>
              <input
                type="search"
                placeholder="Cari produk atau order"
                aria-label="Cari produk atau order"
                className="w-48 border-none bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="text-xs text-slate-400 transition hover:text-slate-600"
                  onClick={() => setSearchTerm("")}
                >
                  Bersihkan
                </button>
              )}
            </form>
            <button
              type="button"
              className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              Admin
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet
            context={{
              adminSearchTerm: searchTerm,
              setAdminSearchTerm: setSearchTerm,
            }}
          />
        </div>
      </div>
    </div>
  );
}
