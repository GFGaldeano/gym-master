"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/header/AppHeader";
import { AppFooter } from "@/components/footer/AppFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Printer, FileSpreadsheet } from "lucide-react";
import {
  fetchUsuarios,
  deleteUsuarios,
  updateUsuarios,
} from "@/services/usuarioService";
import UserModal from "@/components/modal/UserModal";
import UserViewModal from "@/components/modal/UserViewModal";
import UsersTable from "@/components/tables/UserTable";
import { Usuario } from "@/interfaces/usuario.interface";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { toast } from "sonner";
import ExcelJS from "exceljs";

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [usuarioVer, setUsuarioVer] = useState<Usuario | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    const data = await fetchUsuarios();
    setUsuarios(data ?? []);
    setFilteredUsuarios(data ?? []);
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Rol", key: "rol", width: 20 },
      { header: "Activo", key: "activo", width: 10 },
    ];

    filteredUsuarios.forEach((u) => {
      worksheet.addRow({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        activo: u.activo ? "Sí" : "No",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Listado_Usuarios.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleUsuarioActivo = async (usuario: Usuario) => {
    const confirmar = window.confirm(
      usuario.activo
        ? "¿Está seguro de desactivar al usuario?"
        : "¿Está seguro de activar al usuario?"
    );
    if (!confirmar) return;

    try {
      if (usuario.activo) {
        await deleteUsuarios(usuario.id);
        toast.success("Usuario desactivado correctamente");
      } else {
        await updateUsuarios(usuario.id, { activo: true });
        toast.success("Usuario activado correctamente");
      }
      await loadUsuarios();
    } catch (error: unknown) {
      toast.error("Error al actualizar estado del usuario");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadUsuarios();
    }
  }, [status, loadUsuarios]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsuarios(usuarios);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(lowercaseSearch) ||
        u.email.toLowerCase().includes(lowercaseSearch) ||
        u.rol?.toLowerCase().includes(lowercaseSearch)
    );

    setFilteredUsuarios(filtered);
  }, [searchTerm, usuarios]);

  if (status === "loading" || loading) {
    return <p>Cargando datos de usuarios...</p>;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader title="Usuarios" />
          <main className="flex-1 p-6 space-y-6">
            <Card className="w-full">
              <CardHeader className="flex flex-wrap gap-4 justify-between items-center p-4 border-b md:flex-nowrap">
                <h2 className="text-xl font-bold">Listado de Usuarios</h2>
                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                  <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por nombre, email..."
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 bg-white border-[#02a8e1] text-[#02a8e1] hover:bg-[#e6f7fd]"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button
                    onClick={() => setOpenModal(true)}
                    className="bg-[#02a8e1] hover:bg-[#0288b1]"
                  >
                    <span className="hidden sm:inline">Añadir Usuario</span>
                    <span className="sm:hidden">Añadir</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <UsersTable
                    usuarios={filteredUsuarios}
                    loading={loading}
                    onEdit={(usuario) => {
                      setSelectedUsuario(usuario);
                      setOpenModal(true);
                    }}
                    onView={(usuario) => {
                      setUsuarioVer(usuario);
                      setOpenModalVer(true);
                    }}
                    onDelete={toggleUsuarioActivo}
                  />
                </div>
              </CardContent>
            </Card>
          </main>
          <AppFooter />
        </SidebarInset>
      </div>

      <UserModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedUsuario(null);
        }}
        onCreated={loadUsuarios}
        usuario={selectedUsuario}
      />

      <UserViewModal
        open={openModalVer}
        onClose={() => {
          setOpenModalVer(false);
          setUsuarioVer(null);
        }}
        usuario={usuarioVer}
      />
    </SidebarProvider>
  );
}
