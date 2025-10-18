import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([api.getProducts({ limit: 200 }), api.getOrders()])
      .then(([productResponse, orderData]) => {
        if (isMounted) {
          setProducts(productResponse.data ?? []);
          setOrders(orderData);
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

  const totalStock = useMemo(
    () => products.reduce((acc, item) => acc + (item.stock ?? 0), 0),
    [products],
  );

  const totalRevenue = useMemo(
    () => orders.reduce((acc, order) => acc + (order.subtotal ?? 0), 0),
    [orders],
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
        Memuat ringkasan dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-600 shadow-md">
        Gagal memuat data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-xs font-medium uppercase text-slate-400">
            Produk Aktif
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {products.length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-xs font-medium uppercase text-slate-400">
            Total Stok
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalStock}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <p className="text-xs font-medium uppercase text-slate-400">
            Potensi Pendapatan
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {currency.format(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Order Terbaru
          </h2>
          <span className="text-xs text-slate-400">
            {orders.length} order
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            Belum ada order yang tercatat.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-6">
                  <StatusBadge status={order.status} />
                  <p className="text-sm font-semibold text-slate-900">
                    {currency.format(order.subtotal ?? 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
