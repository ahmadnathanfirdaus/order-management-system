import Button from "./Button.jsx";

export default function ProductCard({
  product,
  onClick,
  onAddToCart,
  view = "grid",
}) {
  if (!product) return null;

  const imageSrc = product.images?.[0] || "https://via.placeholder.com/300x200";
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(product.price || 0);

  if (view === "list") {
    return (
      <article className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-md">
        <button
          type="button"
          onClick={onClick}
          className="flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50"
        >
          <img
            src={imageSrc}
            alt={product.title}
            className="h-24 w-24 object-cover object-center"
            loading="lazy"
          />
        </button>

        <div className="flex flex-1 flex-col justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {product.title}
            </h3>
            <p className="text-xs text-slate-500">{product.category}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-primary text-lg font-semibold">
              {formattedPrice}
            </p>
            <span className="text-xs text-slate-500">
              Stok: {product.stock}
            </span>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={onAddToCart}
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl bg-white p-3 shadow-md">
      <button
        type="button"
        onClick={onClick}
        className="block overflow-hidden rounded-xl bg-neutral-50"
      >
        <img
          src={imageSrc}
          alt={product.title}
          className="h-40 w-full object-cover object-center"
          loading="lazy"
        />
      </button>

      <div className="mt-3 space-y-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500">{product.category}</p>
        </div>
        <p className="text-primary text-lg font-semibold">{formattedPrice}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Stok: {product.stock}</span>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={onAddToCart}
        >
          Tambah ke Keranjang
        </Button>
      </div>
    </article>
  );
}
