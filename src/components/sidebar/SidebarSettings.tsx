"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarSettings() {
  const pathname = usePathname();

  const items = [
    { label: "Inicio", href: "/dashboard" }, 
    { label: "Perfil de Usuario", href: "/dashboard/settings" },
    { label: "Preferencias Generales", href: "/dashboard/settings/preferences" },
    { label: "Variables", href: "/dashboard/settings/variables" },
  ];

  return (
    <aside className="w-64 border-r min-h-screen p-6 bg-white dark:bg-zinc-900 transition-colors">
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src="https://ui-avatars.com/api/?name=Steph"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-2 border"
        />
        <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Steph Crown</h2>
        <span className="text-sm text-muted-foreground dark:text-gray-400">@StephCrown</span>
      </div>
      <nav className="space-y-4 w-full">
        {items.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded-lg text-sm w-full transition-colors ${
                isActive
                  ? "text-blue-600 font-medium bg-blue-100 dark:text-blue-400 dark:bg-blue-950"
                  : "text-gray-700 dark:text-gray-200 hover:text-foreground dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}