import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button.jsx";
import InputField from "../../components/InputField.jsx";
import { api } from "../../lib/api.js";

const initialFormState = {
  title: "",
  category: "",
  price: "",
  stock: "",
  description: "",
};

export default function CatalogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let isMounted = true;
    setLoading(true);
    api
      .getProduct(id)
      .then((product) => {
        if (isMounted) {
          setForm({
            title: product.title ?? "",
            category: product.category ?? "",
            price: product.price != null ? String(product.price) : "",
            stock: product.stock != null ? String(product.stock) : "",
            description: product.description ?? "",
          });
          setFetchError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchError(err.message);
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
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!form.title) newErrors.title = "Nama produk wajib diisi";
    if (!form.category) newErrors.category = "Kategori wajib diisi";
    if (!form.price) newErrors.price = "Harga wajib diisi";
    if (!form.stock) newErrors.stock = "Stok wajib diisi";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSaving(true);
      setServerError(null);
      const payload = {
        title: form.title,
        category: form.category,
        price: Number.parseInt(form.price, 10),
        stock: Number.parseInt(form.stock, 10),
        description: form.description,
      };

      if (isEdit) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }

      navigate("/admin/catalog", {
        replace: true,
        state: {
          message: isEdit ? "Perubahan produk tersimpan" : "Produk baru berhasil dibuat",
        },
      });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-md">
        Memuat data produk...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-600 shadow-md">
        {fetchError}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">
          {isEdit ? "Ubah Produk" : "Tambah Produk"}
        </h1>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/admin/catalog")}
        >
          Batal
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Nama Produk"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />
          <InputField
            label="Kategori"
            name="category"
            value={form.category}
            onChange={handleChange}
            error={errors.category}
          />
          <InputField
            label="Harga"
            name="price"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="Contoh: 399000"
          />
          <InputField
            label="Stok"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            error={errors.stock}
            placeholder="Contoh: 10"
          />
        </div>
        <InputField
          label="Deskripsi"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-4"
          hint="Tuliskan highlight dan spesifikasi singkat"
        />
      </div>

      {serverError && (
        <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {serverError}
        </div>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Produk"}
      </Button>
    </form>
  );
}
