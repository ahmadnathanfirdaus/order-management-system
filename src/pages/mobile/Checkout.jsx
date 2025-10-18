import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import InputField from "../../components/InputField.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItems = state?.items ?? [];
  const total = state?.total ?? 0;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = "Nama wajib diisi";
    if (!form.phone) newErrors.phone = "Nomor telepon wajib diisi";
    if (!form.address) newErrors.address = "Alamat pengiriman wajib diisi";
    if (cartItems.length === 0) {
      newErrors.items = "Keranjang masih kosong";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      setServerError(null);
      const order = await api.createOrder({
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          note: form.note,
        },
        items: cartItems,
      });
      navigate("/mobile/order-success", {
        state: { customer: form, order },
        replace: true,
      });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-2xl bg-white p-4 shadow-md">
        <h2 className="text-base font-semibold text-slate-900">
          Data Penerima
        </h2>
        <div className="mt-4 space-y-4">
          <InputField
            label="Nama Lengkap"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama"
            error={errors.name}
          />
          <InputField
            label="No. Telepon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Contoh: 08123456789"
            error={errors.phone}
          />
          <InputField
            label="Alamat Pengiriman"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Tuliskan alamat lengkap"
            error={errors.address}
          />
          <InputField
            label="Catatan untuk Kurir"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Opsional"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total Pembayaran</span>
          <span className="text-lg font-semibold text-slate-900">
            {currency.format(total)}
          </span>
        </div>
        {errors.items && (
          <p className="mt-2 text-xs text-rose-500">{errors.items}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? "Memproses..." : "Buat Order"}
      </Button>
    </form>
  );
}
