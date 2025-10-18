import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { api } from "../../lib/api.js";

export default function Categories() {
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const categoryFilter = outletContext.categoryFilter ?? "";
  const setCategoryFilter = outletContext.setCategoryFilter ?? (() => {});

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getCategories()
      .then((response) => {
        if (!active) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(
          data.sort((a, b) => a.name.localeCompare(b.name, "id")),
        );
        setError(null);
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const groupedCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return categories.reduce((acc, category) => {
      const firstLetter = category.name.charAt(0).toUpperCase();
      const group = acc.find((item) => item.letter === firstLetter);
      if (group) {
        group.items.push(category);
      } else {
        acc.push({ letter: firstLetter, items: [category] });
      }
      return acc;
    }, []).sort((a, b) => a.letter.localeCompare(b.letter, "id"));
  }, [categories]);

  const handleSelect = (category) => {
    setCategoryFilter((prev) => (prev === category.id ? "" : category.id));
    navigate("/mobile/home");
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Semua Kategori
        </h2>
        {categoryFilter && (
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            Reset Kategori
          </button>
        )}
      </div>

      {loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Memuat kategori...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          Gagal memuat kategori: {error}
        </div>
      )}

      {!loading && !error && groupedCategories.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Belum ada kategori yang tersedia.
        </div>
      )}

      {!loading &&
        !error &&
        groupedCategories.map((group) => (
          <div key={group.letter} className="space-y-2">
            <div className="text-xs font-semibold uppercase text-slate-400">
              {group.letter}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {group.items.map((category) => {
                const isActive = categoryFilter === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </section>
  );
}
