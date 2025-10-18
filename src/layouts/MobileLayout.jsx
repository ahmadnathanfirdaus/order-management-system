import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarMobile from "../components/NavbarMobile.jsx";

export default function MobileLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const location = useLocation();
  const searchInputRef = useRef(null);

  const isSearchPage = location.pathname.startsWith("/mobile/search");
  const isCategoriesPage = location.pathname.startsWith("/mobile/categories");
  const isHomePage = location.pathname.startsWith("/mobile/home");

  useEffect(() => {
    if (isSearchPage) {
      searchInputRef.current?.focus();
    }
  }, [isSearchPage]);

  const headerCopy = useMemo(() => {
    if (isSearchPage) {
      return {
        title: "Cari Produk",
        subtitle: "Gunakan kata kunci untuk menemukan barang terbaik",
      };
    }
    if (isCategoriesPage) {
      return {
        title: "Kategori Produk",
        subtitle: "Jelajahi koleksi berdasarkan kategori pilihan",
      };
    }
    if (isHomePage) {
      return {
        title: "OrderGo",
        subtitle: "Temukan produk favoritmu di sini",
      };
    }
    if (location.pathname.startsWith("/mobile/cart")) {
      return {
        title: "Keranjang",
        subtitle: "Periksa kembali pesanan sebelum checkout",
      };
    }
    if (location.pathname.startsWith("/mobile/account")) {
      return {
        title: "Akun Saya",
        subtitle: "Kelola profil dan preferensi akun",
      };
    }
    if (location.pathname.startsWith("/mobile/orders")) {
      return {
        title: "Riwayat Order",
        subtitle: "Pantau status dan detail transaksi",
      };
    }
    return {
      title: "OrderGo",
      subtitle: "Prototype order management system",
    };
  }, [isSearchPage, isCategoriesPage, isHomePage, location.pathname]);

  const showSearchInput = isHomePage || isSearchPage;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-neutral-50 pb-16">
      <header className="sticky top-0 z-20 bg-neutral-50/90 px-4 py-4 backdrop-blur">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {headerCopy.title}
          </h1>
          <p className="text-xs text-slate-500">{headerCopy.subtitle}</p>
        </div>
        {showSearchInput && (
          <div className="mt-3">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Cari produk, kategori, atau brand"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      </header>
      <main className="flex-1 space-y-4 px-4 py-4">
        <Outlet
          context={{
            searchTerm,
            setSearchTerm,
            categoryFilter,
            setCategoryFilter,
          }}
        />
      </main>
      <NavbarMobile />
    </div>
  );
}
