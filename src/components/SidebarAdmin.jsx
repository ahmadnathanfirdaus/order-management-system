import { NavLink } from "react-router-dom";

const items = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Katalog", to: "/admin/catalog" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Pengaturan", to: "/admin/settings" },
];

export default function SidebarAdmin() {
  return (
    <aside className="flex h-full flex-col gap-6 border-r border-slate-200 bg-white px-6 py-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          OrderApp
        </p>
        <h1 className="text-lg font-semibold text-slate-900">
          Panel Admin
        </h1>
      </div>
      <nav className="space-y-2 text-sm font-medium">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-primary/10",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
