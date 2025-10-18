import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard.jsx";
import { api } from "../../lib/api.js";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Produk Pilihan
        </h3>
        <button
          type="button"
          className="text-xs font-medium text-primary"
        >
          Lihat Semua
        </button>
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
        <div className="grid grid-cols-1 gap-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
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
