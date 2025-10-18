import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Beranda", to: "/mobile/home" },
  { label: "Kategori", to: "/mobile/home" },
  { label: "Cari", to: "/mobile/home" },
  { label: "Keranjang", to: "/mobile/cart" },
];

export default function NavbarMobile() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-center justify-around px-4 py-2 text-xs">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  isActive ? "text-primary" : "text-slate-500",
                ].join(" ")
              }
            >
              <span className="text-base">•</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
