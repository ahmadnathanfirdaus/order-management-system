import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function CatalogList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const outletContext = useOutletContext();
  const adminSearchTerm = outletContext?.adminSearchTerm ?? "";
  const setAdminSearchTerm = outletContext?.setAdminSearchTerm ?? (() => {});
  const normalizedSearch = adminSearchTerm.trim().toLowerCase();

  const categoryOptions = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      if (!product.category) return;
      const slug = product.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (!slug || map.has(slug)) return;
      map.set(slug, { id: slug, name: product.category });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "id"),
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const slugify = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const byCategory = categoryFilter
      ? products.filter(
          (product) => slugify(product.category) === categoryFilter,
        )
      : products;

    if (!normalizedSearch) return byCategory;

    return byCategory.filter((product) => {
      const valuesToSearch = [
        product.title,
        product.category,
        product.id,
        product.description,
      ];
      return valuesToSearch.some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      );
    });
  }, [products, normalizedSearch, categoryFilter]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getProducts({ limit: 200 })
      .then((response) => {
        if (isMounted) {
          setProducts(response.data ?? []);
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

  useEffect(() => {
    if (location.state?.message) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Daftar Produk</h1>
          <p className="text-sm text-slate-500">
            Kelola produk yang tampil di aplikasi pelanggan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="catalog-category-filter"
              className="text-xs text-slate-500"
            >
              Kategori
            </label>
            <select
              id="catalog-category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Semua</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-slate-400">
            {adminSearchTerm || categoryFilter
              ? `${filteredProducts.length} dari ${products.length} produk cocok`
              : `${products.length} produk terdata`}
          </div>
          {(adminSearchTerm || categoryFilter) && (
            <button
              type="button"
              className="text-xs font-medium text-primary transition hover:text-primary/80"
              onClick={() => {
                setAdminSearchTerm("");
                setCategoryFilter("");
              }}
            >
              Reset
            </button>
          )}
          <Button onClick={() => navigate("/admin/catalog/new")}>
            + Produk Baru
          </Button>
        </div>
      </div>

      {location.state?.message && (
        <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-600">
          {location.state.message}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
          Memuat katalog produk...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-600 shadow-md">
          Gagal memuat data: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          {filteredProducts.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Tidak ada produk yang cocok dengan filter yang diterapkan.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/60"
                          }
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.title}
                          </p>
                          <p className="text-xs text-slate-400">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {product.category}
                    </td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      {currency.format(product.price ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-primary"
                        onClick={() =>
                          navigate(`/admin/catalog/${product.id}/edit`)
                        }
                      >
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
