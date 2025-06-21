import { LayoutDashboard, Dumbbell, Users, CalendarCheck, Settings } from "lucide-react";
import React from "react";

export interface SidebarItemType {
  title: string;
  link: string;
  level: number;
}

export interface SidebarSectionType {
  title: string;
  icon?: React.ElementType;
  items: SidebarItemType[];
}

export const sections: SidebarSectionType[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [{ title: "Inicio", link: "/dashboard", level: 2 }],
  },
  {
    title: "Gestión del Gimnasio",
    icon: Dumbbell,
    items: [
      { title: "Socios", link: "/dashboard/socios", level: 2 },
      { title: "Actividades", link: "/dashboard/actividades", level: 2 },
      { title: "Entrenadores", link: "/dashboard/entrenadores", level: 2 },
      { title: "Rutinas", link: "/dashboard/rutinas", level: 2 },
      { title: "Dietas", link: "/dashboard/dietas", level: 2 },
    ],
  },
  {
    title: "Asistencias y Turnos",
    icon: CalendarCheck,
    items: [
      { title: "Asistencias", link: "/dashboard/asistencias", level: 2 },
      { title: "Turnos", link: "/dashboard/turnos", level: 2 },
    ],
  },
  {
    title: "Configuración",
    icon: Settings,
    items: [
      { title: "Perfil", link: "/dashboard/settings", level: 2 },
      { title: "Preferencias", link: "/dashboard/settings/preferences", level: 2 },
    ],
  },
];
