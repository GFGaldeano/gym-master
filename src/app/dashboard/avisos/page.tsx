"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/header/AppHeader";
import { AppFooter } from "@/components/footer/AppFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AvisosTable, { Aviso } from "@/components/tables/AvisosTable";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AvisosModal from "@/components/modal/AvisosModal";
import AvisosModalView from "@/components/modal/AvisosModalView";

export default function AvisosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filteredAvisos, setFilteredAvisos] = useState<Aviso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [avisoVer, setAvisoVer] = useState<Aviso | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      setTimeout(() => {
        setAvisos([
          {
            id_aviso: "1",
            asunto: "Corte de luz",
            dia_enviado: "2024-06-01",
          },
          {
            id_aviso: "2",
            asunto: "Nuevo horario",
            dia_enviado: "2024-06-03",
          },
        ]);
        setLoading(false);
      }, 500);
    }
  }, [status]);

  useEffect(() => {
    let avisosFiltrados = avisos;
    if (searchTerm.trim() !== "") {
      const lowercaseSearch = searchTerm.toLowerCase();
      avisosFiltrados = avisosFiltrados.filter(
        (a) =>
          a.asunto.toLowerCase().includes(lowercaseSearch) ||
          a.dia_enviado.toLowerCase().includes(lowercaseSearch)
      );
    }
    setFilteredAvisos(avisosFiltrados);
  }, [searchTerm, avisos]);

  if (status === "loading" || loading) {
    return <p>Cargando datos de avisos...</p>;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Avisos" />
          <main className="flex-1 p-6 space-y-6">
            <Card className="w-full">
              <CardHeader className="flex flex-wrap items-center justify-between gap-4 p-4 border-b md:flex-nowrap">
                <h2 className="text-xl font-bold">Listado de Avisos</h2>
                <div className="flex flex-wrap items-center w-full gap-2 md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por asunto o fecha..."
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-[#02a8e1] hover:bg-[#0288b1]"
                    onClick={() => {
                      setSelectedAviso(null);
                      setOpenModal(true);
                    }}
                  >
                    <span className="hidden sm:inline">Añadir Aviso</span>
                    <span className="sm:hidden">Añadir</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="overflow-x-auto">
                  <AvisosTable
                    avisos={filteredAvisos}
                    loading={loading}
                    onEdit={(aviso) => {
                      setSelectedAviso(aviso);
                      setOpenModal(true);
                    }}
                    onView={(aviso) => {
                      setAvisoVer(aviso);
                      setOpenModalVer(true);
                    }}
                    onDelete={() => {}}
                  />
                </div>
              </CardContent>
            </Card>
          </main>
          <AppFooter />
        </SidebarInset>
      </div>
      <AvisosModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedAviso(null);
        }}
        onCreated={() => {}}
        aviso={selectedAviso}
      />
      <AvisosModalView
        open={openModalVer}
        onClose={() => {
          setOpenModalVer(false);
          setAvisoVer(null);
        }}
        aviso={avisoVer}
      />
    </SidebarProvider>
  );
}
