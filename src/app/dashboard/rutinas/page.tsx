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
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import RutinasTable, { Rutina } from "@/components/tables/RutinasTable";
import RutinaModal from "@/components/modal/RutinaModal";
import RutinaModalView from "@/components/modal/RutinaModalView";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const rutinasHardcodeadas: Rutina[] = [
  {
    id_rutina: "1",
    socio: "Juan Pérez",
    objetivo: "Hipertrofia",
    nivel: "Intermedio",
    fecha: "2024-06-10",
    dias: "Lunes, Miércoles, Viernes",
  },
  {
    id_rutina: "2",
    socio: "María Gómez",
    objetivo: "Definición",
    nivel: "Avanzado",
    fecha: "2024-06-11",
    dias: "Lunes, Martes, Jueves",
  },
  {
    id_rutina: "3",
    socio: "Carlos López",
    objetivo: "Fuerza",
    nivel: "Principiante",
    fecha: "2024-06-12",
    dias: "Martes, Jueves, Viernes",
  },
  {
    id_rutina: "4",
    socio: "Juan Pérez",
    objetivo: "Resistencia",
    nivel: "Intermedio",
    fecha: "2024-06-13",
    dias: "Lunes, Miércoles, Viernes",
  },
  {
    id_rutina: "5",
    socio: "María Gómez",
    objetivo: "Hipertrofia",
    nivel: "Avanzado",
    fecha: "2024-06-14",
    dias: "Lunes, Martes, Miércoles",
  },
];

export default function RutinasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [filteredRutinas, setFilteredRutinas] = useState<Rutina[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [rutinaVer, setRutinaVer] = useState<Rutina | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const fetchRutinas = async () => {
    setLoading(true);
    const data = rutinasHardcodeadas;
    setRutinas(data ?? []);
    setFilteredRutinas(data ?? []);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const tableBody = [
      ["Socio", "Objetivo", "Nivel", "Fecha", "Días"],
      ...filteredRutinas.map((r) => [
        r.socio,
        r.objetivo,
        r.nivel,
        r.fecha,
        r.dias,
      ]),
    ];

    const docDefinition: import("pdfmake/interfaces").TDocumentDefinitions = {
      content: [
        {
          text: "Listado de Rutinas",
          style: "header",
          margin: [0, 0, 0, 12] as [number, number, number, number],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
      pageOrientation: "landscape",
    };

    pdfMake.createPdf(docDefinition).download("Listado_Rutinas.pdf");
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchRutinas();
    }
  }, [status]);

  useEffect(() => {
    let rutinasFiltradas = rutinas;
    if (searchTerm.trim() !== "") {
      const lowercaseSearch = searchTerm.toLowerCase();
      rutinasFiltradas = rutinasFiltradas.filter(
        (r) =>
          r.socio.toLowerCase().includes(lowercaseSearch) ||
          r.objetivo.toLowerCase().includes(lowercaseSearch) ||
          r.nivel.toLowerCase().includes(lowercaseSearch)
      );
    }
    setFilteredRutinas(rutinasFiltradas);
  }, [searchTerm, rutinas]);

  if (status === "loading" || loading) {
    return <p>Cargando datos de rutinas...</p>;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Rutinas" />
          <main className="flex-1 p-6 space-y-6">
            <Card className="w-full">
              <CardHeader className="flex flex-wrap items-center justify-between gap-4 p-4 border-b md:flex-nowrap">
                <h2 className="text-xl font-bold">Listado de Rutinas</h2>
                <div className="flex flex-wrap items-center w-full gap-2 md:w-auto">
                  <div className="flex items-center flex-grow gap-2 md:flex-grow-0">
                    <div className="relative flex-grow md:flex-grow-0">
                      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar por socio, objetivo, nivel..."
                        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-[#02a8e1] text-[#02a8e1] hover:bg-[#e6f7fd]"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Imprimir</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-white border-[#02a8e1] text-[#02a8e1] hover:bg-[#e6f7fd]"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button
                    onClick={() => setOpenModal(true)}
                    className="bg-[#02a8e1] hover:bg-[#0288b1]"
                  >
                    <span className="hidden sm:inline">Añadir Rutina</span>
                    <span className="sm:hidden">Añadir</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="overflow-x-auto">
                  <RutinasTable
                    rutinas={filteredRutinas}
                    loading={loading}
                    onEdit={(rutina) => {
                      setSelectedRutina(rutina);
                      setOpenModal(true);
                    }}
                    onView={(rutina) => {
                      setRutinaVer(rutina);
                      setOpenModalVer(true);
                    }}
                    onDelete={async () => {
                      const confirmar = window.confirm(
                        "¿Está seguro de eliminar la rutina?"
                      );
                      if (!confirmar) return;
                      toast.success("Rutina eliminada correctamente");
                      fetchRutinas();
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </main>
          <AppFooter />
        </SidebarInset>
      </div>

      <RutinaModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedRutina(null);
        }}
        onCreated={fetchRutinas}
        rutina={selectedRutina}
      />

      <RutinaModalView
        open={openModalVer}
        onClose={() => {
          setOpenModalVer(false);
          setRutinaVer(null);
        }}
        rutina={rutinaVer}
      />
    </SidebarProvider>
  );
}
