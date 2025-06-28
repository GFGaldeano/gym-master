"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "../ui/sidebar";
import { Menu, X } from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { useIsMobile } from "@/hooks/use-mobile";
import "@/app/styles/scrollbar.css";
import { useSession } from "next-auth/react";
import { useSidebarMenu } from "@/hooks/useSidebarSection";
import { usePathname } from "next/navigation";

export const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const userType = session?.user?.userType;
  const menuSections = useSidebarMenu(userType);

  useEffect(() => {}, [isMobile]);

  if (status === "loading") {
    return (
      <aside
        style={{
          width: "240px",
          background: "#2c3e50",
          color: "#ecf0f1",
          padding: "20px",
          minHeight: "100vh",
          boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{ textAlign: "center", color: "#1abc9c", fontSize: "1.2em" }}
        >
          Cargando menú...
        </div>
      </aside>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 text-black bg-transparent"
        >
          <Menu size={24} />
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar
        className={`transition-transform duration-300 transform ${
          isMobile
            ? `absolute top-0 left-0 h-full w-64 text-sidebar-foreground z-50 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              } bg-[var(--color-sidebar)]`:`w-64 min-w-[16rem] max-w-[16rem] h-auto border-r border-b rounded-lg z-30 overflow-y-auto max-h-screen bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)]`} sidebar-scrollbar`}
      >
        {isMobile && (
          <div className="absolute top-4 right-4 z-50">
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
        )}
        <div className="mt-5 text-xl font-semibold tracking-tight text-center">
          Gym Master
        </div>

        {menuSections.map((section, idx) => (
          <SidebarSection
            key={idx}
            title={section.title}
            icon={section.icon}
            items={section.items}
            isMobile={isMobile}
            closeSidebar={() => setIsOpen(false)}
          />
        ))}
      </Sidebar>
    </>
  );
};
