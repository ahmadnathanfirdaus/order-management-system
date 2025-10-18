import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Beranda", to: "/mobile/home", Icon: HomeIcon, end: true },
  { label: "Kategori", to: "/mobile/categories", Icon: Squares2X2Icon },
  { label: "Cari", to: "/mobile/search", Icon: MagnifyingGlassIcon },
  { label: "Keranjang", to: "/mobile/cart", Icon: ShoppingBagIcon },
  { label: "Akun", to: "/mobile/account", Icon: UserCircleIcon },
];

export default function NavbarMobile() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-center justify-around px-4 py-2 text-xs">
        {navItems.map(({ label, to, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  isActive ? "text-primary" : "text-slate-500",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
