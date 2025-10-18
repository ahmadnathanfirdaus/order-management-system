import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { api } from "../../lib/api.js";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch (_error) {
      return [];
    }
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const added = location.state?.add;
    if (added?.productId) {
      setItems((prev) => {
        const exists = prev.find((item) => item.productId === added.productId);
        if (exists) {
          return prev.map((item) =>
            item.productId === added.productId
              ? { ...item, qty: item.qty + 1 }
              : item,
          );
        }
        return [...prev, { productId: added.productId, qty: 1 }];
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (_error) {
      // ignore write errors
    }
  }, [items]);

  const cartDetail = useMemo(() => {
    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return {
          ...item,
          product: {
            id: item.productId,
            title: "Produk tidak tersedia",
            category: "",
            price: 0,
            images: [],
          },
          subtotal: 0,
          unavailable: true,
        };
      }
      return {
        ...item,
        product,
        subtotal: product.price * item.qty,
        unavailable: false,
      };
    });
  }, [items, products]);

  const total = useMemo(
    () => cartDetail.reduce((acc, item) => acc + item.subtotal, 0),
    [cartDetail],
  );
  const hasPurchasable = cartDetail.some((item) => !item.unavailable);

  const updateQty = (productId, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCheckout = () => {
    const purchasableItems = cartDetail.filter((item) => !item.unavailable);
    if (purchasableItems.length === 0) return;

    navigate("/mobile/checkout", {
      state: {
        items: purchasableItems.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
        total: purchasableItems.reduce(
          (sum, item) => sum + item.subtotal,
          0,
        ),
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-900">
        Keranjang Belanja
      </h1>

      {loading && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-md">
          Memuat keranjang...
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600">
          Gagal memuat produk: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-3">
            {cartDetail.length === 0 ? (
              <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
                Keranjang kamu masih kosong.
              </div>
            ) : (
          cartDetail.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 rounded-xl bg-white p-4 shadow-md"
            >
              <img
                    src={
                      item.product.images?.[0] ||
                      "https://via.placeholder.com/100"
                    }
                    alt={item.product.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {item.product.category}
                      </p>
                      {item.unavailable && (
                        <p className="mt-1 text-xs text-amber-500">
                          Produk tidak lagi tersedia.
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 px-2 py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, -1)}
                          className="px-2"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.productId, 1)}
                          className="px-2"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {currency.format(item.subtotal)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-rose-500"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total</span>
              <span className="text-lg font-semibold text-slate-900">
                {currency.format(total)}
              </span>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={handleCheckout}
              disabled={!hasPurchasable}
            >
              Lanjut ke Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
