import { NavLink } from "react-router-dom";
import {
  Squares2X2Icon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const items = [
  { label: "Dashboard", to: "/admin/dashboard", Icon: Squares2X2Icon },
  { label: "Katalog", to: "/admin/catalog", Icon: ArchiveBoxIcon },
  { label: "Orders", to: "/admin/orders", Icon: ClipboardDocumentListIcon },
  { label: "Pengaturan", to: "/admin/settings", Icon: Cog6ToothIcon },
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
        {items.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-primary/10",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
