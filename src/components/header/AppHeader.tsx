import { useSession } from "next-auth/react";
import React from "react";
import { useSidebar } from "../ui/sidebar";
import { Search, Bell, Settings, Sun, Moon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import FechaHora from "../ui/FechaHora"; // ← muestra fecha/hora en vivo
import Image from "next/image";

/* ----------------------------------------------------------------
   Hook: Dark Mode (toggle y persistencia en localStorage)
   ---------------------------------------------------------------- */
function useDarkMode() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    // 1️⃣ Leemos la preferencia guardada o la del sistema
    const saved = localStorage.getItem("theme");
    const prefersSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : prefersSystem;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = React.useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { dark, toggle };
}

interface AppHeaderProps {
  title: string;
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  const router         = useRouter();
  const { data: session } = useSession();
  const { isMobile }   = useSidebar();     // <- por si lo necesitas luego
  const { dark, toggle } = useDarkMode();

  /* --------------------------------------------------------------
     Util: genera iniciales para el avatar cuando no hay imagen
     -------------------------------------------------------------- */
  const getInitials = (email = "") => {
    const parts = email.split("@")[0].split(".");
    return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "U";
  };

  const userEmail = session?.user?.email ?? "";
  const initials  = getInitials(userEmail);

  return (
    <header className="w-full flex justify-between items-center py-3 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ---------- Logo y Título ---------- */}
      <div className="flex items-center gap-3">
        <Image 
          src="/chang-logo.jpg" 
          alt="Chang Logo" 
          width={40} 
          height={40} 
          className="rounded-sm" 
        />
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>

      {/* ---------- Iconos/acciones ---------- */}
      <div className="flex items-center gap-4">
        {/* Dark Mode */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={toggle}
                aria-label="Cambiar modo claro/oscuro"
              >
                {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{dark ? "Modo claro" : "Modo oscuro"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Fecha y hora en tiempo real */}
        <FechaHora />

        {/* Búsqueda */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Buscar</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notificaciones */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notificaciones</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Configuración */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configuración</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Avatar usuario */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <Avatar
                  src={session?.user?.image ?? undefined}
                  alt={userEmail}
                  initials={initials}
                  size={32}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{userEmail}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
