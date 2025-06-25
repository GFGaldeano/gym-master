"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/header/AppHeader";
import { AppFooter } from "@/components/footer/AppFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Printer, FileSpreadsheet } from "lucide-react";
import { fetchSocios, toggleSocioActivo } from "@/services/socioService";
import SocioModal from "@/components/modal/SocioModal";
import SocioViewModal from "@/components/modal/SocioViewModal";
import SociosTable, { Socio } from "@/components/tables/SociosTable";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import ExcelJS from "exceljs";

export default function SociosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [socios, setSocios] = useState<Socio[]>([]);
  const [filteredSocios, setFilteredSocios] = useState<Socio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [socioVer, setSocioVer] = useState<Socio | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const loadSocios = async () => {
    setLoading(true);
    const data = await fetchSocios();
    setSocios(data ?? []);
    setFilteredSocios(data ?? []);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Socios");

    worksheet.columns = [
      { header: "Nombre completo", key: "nombre_completo", width: 30 },
      { header: "DNI", key: "dni", width: 20 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Dirección", key: "direccion", width: 40 },
      { header: "Fecha Alta", key: "fecha_alta", width: 20 },
    ];

    filteredSocios.forEach((s) => {
      worksheet.addRow({
        nombre_completo: s.nombre_completo,
        dni: s.dni,
        telefono: s.telefono,
        email: s.email,
        direccion: s.direccion,
        fecha_alta: s.fecha_alta,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Listado_Socios.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadSocios();
    }
  }, [status]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSocios(socios);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = socios.filter(
      (s) =>
        s.nombre_completo.toLowerCase().includes(lowercaseSearch) ||
        s.dni.toLowerCase().includes(lowercaseSearch) ||
        s.telefono?.toLowerCase().includes(lowercaseSearch) ||
        s.email?.toLowerCase().includes(lowercaseSearch)
    );

    setFilteredSocios(filtered);
  }, [searchTerm, socios]);

  if (status === "loading" || loading) {
    return <p>Cargando datos de socios...</p>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Socios" />
          <main className="flex-1 p-6 space-y-6">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <span className="text-lg font-semibold">Listado de Socios</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-white border-[#02a8e1] text-[#02a8e1] hover:bg-[#e6f7fd]"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Imprimir</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-white border-[#02a8e1] text-[#02a8e1] hover:bg-[#e6f7fd]"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Exportar Excel</span>
                  </Button>
                  <Button
                    onClick={() => setOpenModal(true)}
                    className="bg-[#02a8e1] hover:bg-[#0288b1]"
                  >
                    Añadir Socio
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#02a8e1]" />
                  <Input
                    type="search"
                    placeholder="Buscar socio por nombre, DNI, teléfono..."
                    className="pl-8 w-full border-[#02a8e1] focus-visible:ring-[#02a8e1]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <SociosTable
                    socios={filteredSocios}
                    loading={loading}
                    onEdit={(socio) => {
                      setSelectedSocio(socio);
                      setOpenModal(true);
                    }}
                    onView={(socio) => {
                      setSocioVer(socio);
                      setOpenModalVer(true);
                    }}
                    onDelete={async (socio) => {
                      const confirmar = window.confirm(
                        socio.activo
                          ? "¿Está seguro de desactivar al socio?"
                          : "¿Está seguro de activar al socio?"
                      );
                      if (!confirmar) return;

                      try {
                        await toggleSocioActivo(socio);
                        toast.success(
                          `Socio ${socio.activo ? "desactivado" : "activado"} correctamente`
                        );
                        await loadSocios();
                      } catch (err) {
                        toast.error("Error al actualizar estado del socio");
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </main>
          <AppFooter />
        </SidebarInset>
      </div>

      <SocioModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedSocio(null);
        }}
        onCreated={loadSocios}
        socio={selectedSocio}
      />

      <SocioViewModal
        open={openModalVer}
        onClose={() => {
          setOpenModalVer(false);
          setSocioVer(null);
        }}
        socio={socioVer}
      />
    </SidebarProvider>
  );
}
