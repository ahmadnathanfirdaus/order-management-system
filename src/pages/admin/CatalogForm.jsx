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
  images: [],
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
  const [imageLink, setImageLink] = useState("");
  const [imageError, setImageError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
            images: Array.isArray(product.images) ? product.images : [],
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

  const handleAddImageLink = () => {
    if (!imageLink.trim()) {
      setImageError("Mohon masukkan URL gambar");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, imageLink.trim()],
    }));
    setImageLink("");
    setImageError(null);
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    setImageError(null);

    try {
      const result = await api.uploadImage(formData);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, result.url],
      }));
    } catch (error) {
      setImageError(error.message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== url),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!form.title) newErrors.title = "Nama produk wajib diisi";
    if (!form.category) newErrors.category = "Kategori wajib diisi";
    if (!form.price) newErrors.price = "Harga wajib diisi";
    if (!form.stock) newErrors.stock = "Stok wajib diisi";
    if (!form.images?.length) newErrors.images = "Minimal satu gambar produk";
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
        images: form.images,
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

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Gambar Produk</p>
            {errors.images && (
              <span className="text-xs text-rose-500">{errors.images}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {form.images.length === 0 ? (
              <p className="text-xs text-slate-500">
                Belum ada gambar yang ditambahkan.
              </p>
            ) : (
              form.images.map((image) => (
                <div
                  key={image}
                  className="relative"
                >
                  <img
                    src={image}
                    alt=""
                    className="h-24 w-24 rounded-xl object-cover shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow"
                    aria-label="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Tambah via Link
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="url"
                value={imageLink}
                onChange={(event) => {
                  setImageLink(event.target.value);
                  setImageError(null);
                }}
                placeholder="https://contoh.com/gambar.jpg"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                onClick={handleAddImageLink}
                disabled={!imageLink}
              >
                Tambah
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Upload dari Komputer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              disabled={uploadingImage}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary/90 disabled:file:bg-primary/50"
            />
            {uploadingImage && (
              <p className="text-xs text-slate-400">Mengunggah gambar...</p>
            )}
          </div>

          {imageError && (
            <p className="text-xs text-rose-500">{imageError}</p>
          )}
        </div>
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
