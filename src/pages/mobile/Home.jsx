import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";
import ProductCard from "../../components/ProductCard.jsx";
import { api } from "../../lib/api.js";

const PAGE_SIZE = 6;

export default function Home() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm ?? "";
  const setSearchTerm = outletContext.setSearchTerm ?? (() => {});

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid");

  const sentinelRef = useRef(null);

  useEffect(() => {
    let active = true;
    setCategoriesLoading(true);
    api
      .getCategories()
      .then((response) => {
        if (!active) return;
        setCategories(response.data ?? []);
        setCategoriesError(null);
      })
      .catch((err) => {
        if (active) {
          setCategoriesError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setCategoriesLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.getProducts({
          search: searchTerm,
          category: selectedCategory || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        const nextItems = response.data ?? [];
        setProducts((prev) =>
          page === 1 ? nextItems : [...prev, ...nextItems],
        );
        setHasMore(response.meta?.hasNextPage ?? false);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectedCategory, page]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPage((prev) => prev + 1);
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading]);

  const isGrid = displayMode === "grid";
  const isSearching = Boolean(searchTerm.trim());
  const isFilteringByCategory = Boolean(selectedCategory);
  const isFiltering = isSearching || isFilteringByCategory;
  const noResults =
    !initialLoading && products.length === 0 && !loading && !error;

  const categoriesToRender = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories;
  }, [categories]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-primary px-4 py-6 text-white shadow-md">
        <h2 className="text-lg font-semibold">Promo Spesial Minggu Ini</h2>
        <p className="mt-2 text-sm text-blue-100">
          Dapatkan diskon hingga 20% untuk produk pilihan.
        </p>
        <button
          type="button"
          onClick={() => navigate("/mobile/home")}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary"
        >
          Lihat Semua
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          {isFiltering ? "Hasil Filter" : "Produk Pilihan"}
        </h3>
        <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1 text-xs font-medium text-slate-500">
          <button
            type="button"
            onClick={() => setDisplayMode("list")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
              displayMode === "list"
                ? "bg-white text-primary shadow-sm"
                : "hover:text-primary"
            }`}
            aria-pressed={displayMode === "list"}
          >
            <Bars3Icon className="h-4 w-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode("grid")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
              isGrid ? "bg-white text-primary shadow-sm" : "hover:text-primary"
            }`}
            aria-pressed={isGrid}
          >
            <Squares2X2Icon className="h-4 w-4" />
            Grid
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Kategori</p>
          {(selectedCategory || isSearching) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("");
                setSearchTerm("");
              }}
              className="text-xs font-medium text-primary hover:text-primary/80"
            >
              Bersihkan filter
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition ${
              selectedCategory === ""
                ? "border-primary bg-primary/10 text-primary"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
            }`}
          >
            Semua
          </button>
          {categoriesLoading && (
            <span className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-400">
              Memuat...
            </span>
          )}
          {!categoriesLoading &&
            categoriesToRender.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev === category.id ? "" : category.id,
                    )
                  }
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition ${
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
        {categoriesError && (
          <p className="text-xs text-rose-500">
            Gagal memuat kategori: {categoriesError}
          </p>
        )}
      </div>

      {initialLoading && loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Memuat produk...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          Gagal memuat data: {error}
        </div>
      )}

      {noResults && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Produk tidak ditemukan untuk kata kunci tersebut.
        </div>
      )}

      {products.length > 0 && (
        <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              view={displayMode}
              onClick={() => navigate(`/mobile/product/${product.id}`)}
              onAddToCart={() =>
                navigate("/mobile/cart", {
                  state: {
                    add: { productId: product.id, ts: Date.now() },
                  },
                })
              }
            />
          ))}
        </div>
      )}

      {loading && !initialLoading && (
        <div className="rounded-xl bg-white p-3 text-center text-xs text-slate-500 shadow-md">
          Memuat produk berikutnya...
        </div>
      )}

      {hasMore && !loading && (
        <div ref={sentinelRef} className="h-4 w-full" />
      )}

      {(isSearching || isFilteringByCategory) && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("");
          }}
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 hover:border-primary hover:text-primary"
        >
          Bersihkan filter
        </button>
      )}
    </section>
  );
}
