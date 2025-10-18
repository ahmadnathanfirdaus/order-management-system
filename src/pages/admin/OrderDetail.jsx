import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { api } from "../../lib/api.js";

const statuses = ["Baru", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Baru");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getOrder(id)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          setStatus(data.status);
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

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await api.updateOrder(id, { status: newStatus });
      setOrder(updated);
      setFeedback({
        type: "success",
        message: "Status order berhasil diperbarui.",
      });
    } catch (err) {
      setStatus(order?.status ?? "Baru");
      setFeedback({
        type: "error",
        message: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
        Memuat detail order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4 rounded-2xl bg-rose-50 p-6 text-sm text-rose-600 shadow-md">
        <p>{error || "Order tidak ditemukan."}</p>
        <Button variant="secondary" onClick={() => navigate("/admin/orders")}>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{order.id}</h1>
          <p className="text-sm text-slate-500">
            Dipesan oleh {order.customer.name}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/admin/orders")}>
          Kembali
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-sm font-semibold text-slate-900">
            Informasi Pelanggan
          </h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Nama: {order.customer.name}</p>
            <p>Telepon: {order.customer.phone}</p>
            <p>Alamat: {order.customer.address}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-sm font-semibold text-slate-900">
            Status Order
          </h2>
          <div className="mt-3 space-y-3">
            <StatusBadge status={status} />
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600">Ubah status</span>
              <select
                value={status}
                onChange={handleStatusChange}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-slate-400">
              Perubahan tersimpan di server mock dan akan hilang saat server
              dimulai ulang.
            </p>
            {feedback && (
              <div
                className={`rounded-lg px-3 py-2 text-xs ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-sm font-semibold text-slate-900">Ringkasan Item</h2>
        <div className="mt-3 space-y-3 text-sm text-slate-600">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-400">
                  Qty {item.qty} × {currency.format(item.price)}
                </p>
              </div>
              <p className="font-medium text-slate-900">
                {currency.format(item.qty * item.price)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="text-lg font-semibold text-slate-900">
            {currency.format(order.subtotal ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
