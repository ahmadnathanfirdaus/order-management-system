import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";
import ProductCard from "../../components/ProductCard.jsx";
import { api } from "../../lib/api.js";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = useMemo(() => products.slice(0, 4), [products]);
  const isGrid = displayMode === "grid";

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
          Produk Pilihan
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

      {loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Memuat produk...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          Gagal memuat data: {error}
        </div>
      )}

      {!loading && !error && (
        <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              view={displayMode}
              onClick={() => navigate(`/mobile/product/${product.id}`)}
              onAddToCart={() =>
                navigate("/mobile/cart", {
                  state: {
                    add: { productId: product.id },
                  },
                })
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
