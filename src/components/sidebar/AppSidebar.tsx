"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarContent, useSidebar } from "../ui/sidebar";
import { Menu, X } from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { sections } from "./sidebarConfig";
import { useIsMobile } from "@/hooks/use-mobile";

export const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  /*   const { isMobile } = useSidebar(); */

  useEffect(() => {
    console.log("Es mobile:", isMobile);
  }, [isMobile]);

  return (
    <>
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-transparent text-black"
        >
          <Menu size={24} />
        </button>
      )}

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar
        className={`transition-transform duration-300 transform  ${
          isMobile
            ? `absolute top-0 left-0 h-full w-64 bg-white z-50 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64 min-w-[16rem] max-w-[16rem] h-auto bg-white border-r border-b rounded-lg z-30"
        } max-h-screen overflow-y-auto sidebar-scrollbar `}
      >
        <SidebarContent>
          {isMobile && (
            <div className="absolute top-4 right-4 z-50">
              <button onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
          )}
          <div className="mt-5 text-center text-xl font-semibold tracking-tight">
            Gym Master
          </div>

          {sections.map((section, idx) => (
            <SidebarSection
              key={idx}
              title={section.title}
              icon={section.icon}
              items={section.items}
              isMobile={isMobile}
              closeSidebar={() => setIsOpen(false)}
            />
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
};
