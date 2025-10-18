import clsx from "clsx";

const statusColors = {
  Baru: "bg-blue-100 text-blue-600",
  Diproses: "bg-amber-100 text-amber-600",
  Dikirim: "bg-sky-100 text-sky-600",
  Selesai: "bg-emerald-100 text-emerald-600",
  Dibatalkan: "bg-rose-100 text-rose-600",
};

export default function StatusBadge({ status }) {
  const colorClass = statusColors[status] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        colorClass,
      )}
    >
      {status}
    </span>
  );
}
