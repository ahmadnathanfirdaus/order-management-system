import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function OrdersList() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getOrders()
      .then((data) => {
        if (isMounted) {
          setOrders(data);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Daftar Order
          </h1>
          <p className="text-sm text-slate-500">
            Pantau status dan detail order pelanggan.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          {orders.length} order terdata
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
          Memuat daftar order...
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-600 shadow-md">
          Gagal memuat data: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Belum ada order yang tercatat.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div>{order.customer.name}</div>
                      <div className="text-slate-400">
                        {order.customer.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {currency.format(order.subtotal ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-primary"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
