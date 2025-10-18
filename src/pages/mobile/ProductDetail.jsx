import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getProduct(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
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
  }, [id]);

  const formattedPrice = useMemo(
    () => (product ? currency.format(product.price ?? 0) : ""),
    [product],
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
        Memuat detail produk...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-slate-500">
          {error || "Produk tidak ditemukan."}
        </p>
        <Button onClick={() => navigate(-1)}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-white shadow-md">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x300"}
          alt={product.title}
          className="h-56 w-full object-cover"
        />
        <div className="space-y-4 px-4 py-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">{product.category}</p>
            <h1 className="text-xl font-semibold text-slate-900">
              {product.title}
            </h1>
            <p className="text-lg font-semibold text-primary">
              {formattedPrice}
            </p>
            <p className="text-xs text-slate-500">
              Stok tersedia: {product.stock}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Deskripsi Produk
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="space-y-2 rounded-xl bg-neutral-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Spesifikasi</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-slate-500">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() =>
            navigate("/mobile/cart", {
              state: { view: { productId: product.id } },
            })
          }
          className="w-full"
        >
          Lihat Keranjang
        </Button>
        <Button
          onClick={() =>
            navigate("/mobile/cart", {
              state: { add: { productId: product.id, ts: Date.now() } },
            })
          }
          className="w-full"
        >
          Tambah ke Keranjang
        </Button>
      </div>
    </div>
  );
}
