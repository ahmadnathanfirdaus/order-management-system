import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductCard from "../../components/ProductCard.jsx";
import { api } from "../../lib/api.js";

export default function Search() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm ?? "";
  const setSearchTerm = outletContext.setSearchTerm ?? (() => {});
  const categoryFilter = outletContext.categoryFilter ?? "";
  const setCategoryFilter = outletContext.setCategoryFilter ?? (() => {});

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const normalizedQuery = searchTerm.trim();
  const isFilteringByCategory = Boolean(categoryFilter);

  useEffect(() => {
    let active = true;
    api
      .getCategories()
      .then((response) => {
        if (!active) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data.sort((a, b) => a.name.localeCompare(b.name, "id")));
      })
      .catch(() => {
        /* kategori tidak wajib untuk halaman ini */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!normalizedQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getProducts({
        search: normalizedQuery,
        category: categoryFilter || undefined,
        limit: 24,
      })
      .then((response) => {
        if (!cancelled) {
          setResults(response.data ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedQuery, categoryFilter]);

  const suggestionCategories = useMemo(() => {
    return categories.slice(0, 6);
  }, [categories]);

  const handleClearAll = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setResults([]);
  };

  return (
    <section className="space-y-4">
      {suggestionCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              Jelajahi Kategori
            </p>
            <button
              type="button"
              onClick={() => navigate("/mobile/categories")}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              Lihat Semua
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestionCategories.map((category) => {
              const isActive = categoryFilter === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setCategoryFilter((prev) =>
                      prev === category.id ? "" : category.id,
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isFilteringByCategory && (
        <div className="rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary">
          Menampilkan hasil untuk kategori terpilih.{" "}
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Hapus kategori
          </button>
        </div>
      )}

      {normalizedQuery === "" && (
        <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-md">
          Masukkan kata kunci pada kolom pencarian di atas untuk melihat hasil.
        </div>
      )}

      {normalizedQuery && loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Mencari produk untuk &ldquo;{normalizedQuery}&rdquo;...
        </div>
      )}

      {normalizedQuery && error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          Terjadi kesalahan: {error}
        </div>
      )}

      {normalizedQuery && !loading && !error && results.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Tidak ditemukan produk untuk kata kunci tersebut.
        </div>
      )}

      {normalizedQuery && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Hasil Pencarian ({results.length})
            </h3>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              Bersihkan
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view="grid"
                onClick={() => navigate(`/mobile/product/${product.id}`)}
                onAddToCart={() =>
                  navigate("/mobile/cart", {
                    state: { add: { productId: product.id, ts: Date.now() } },
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
