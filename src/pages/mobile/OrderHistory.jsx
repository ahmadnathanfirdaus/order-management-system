import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getOrders()
      .then((data) => {
        if (!cancelled) {
          setOrders(data ?? []);
          setError(null);
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
  }, []);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">
          Riwayat Order
        </h1>
        <p className="text-sm text-slate-500">
          Pantau status order kamu di sini.
        </p>
      </header>

      {loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Memuat riwayat order...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600 shadow-md">
          Gagal memuat data: {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Belum ada order yang tercatat.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="space-y-3 rounded-2xl bg-white p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order.customer.name} · {order.customer.phone}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between"
                  >
                    <span>{item.title}</span>
                    <span className="text-xs text-slate-500">
                      Qty {item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-500">Total</span>
                <span className="text-base font-semibold text-slate-900">
                  {currency.format(order.subtotal ?? 0)}
                </span>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                disabled
              >
                Detail (Coming Soon)
              </Button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
