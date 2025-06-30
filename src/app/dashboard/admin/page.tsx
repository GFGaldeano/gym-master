"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/header/AppHeader";
import { AppFooter } from "@/components/footer/AppFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageSubheader } from "@/components/header/PageSubHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Verificando sesión...</p>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full min-h-screen">
        <div className="flex flex-1">
          <div className="overflow-x-auto flex-1 p-6 space-y-4 max-w-full">
            <AppHeader title="Panel de Administración" />

            <Card className="w-full">
              <CardHeader>
                <span className="text-lg font-semibold">Resumen General</span>
              </CardHeader>
              <CardContent>
                {/* Aquí podés agregar estadísticas, accesos rápidos o widgets */}
                <p>Contenido del dashboard. Métricas, accesos rápidos, etc.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <AppFooter />
      </div>
    </SidebarProvider>
  );
}
