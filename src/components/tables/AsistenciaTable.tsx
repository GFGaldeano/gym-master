"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Asistencia } from "@/interfaces/asistencia.interface";

export default function AsistenciaTable({
  asistencias,
  loading,
  onEdit,
  onView,
  onDelete,
}: {
  asistencias: Asistencia[];
  loading?: boolean;
  onEdit: (asistencia: Asistencia) => void;
  onView?: (asistencia: Asistencia) => void;
  onDelete?: (asistencia: Asistencia) => void | Promise<void>;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-9 rounded-md" />
        ))}
      </div>
    );
  }

  if (asistencias.length === 0 && !loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No hay asistencias registradas aún.
      </div>
    );
  }

  return (
    <Table className="overflow-hidden w-full text-sm rounded-md border border-border">
      <TableHeader>
        <TableRow className="bg-muted/50 text-muted-foreground">
          <TableHead>ID Asistencia</TableHead>
          <TableHead>ID Socio</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora Ingreso</TableHead>
          <TableHead>Hora Egreso</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {asistencias.map((a, i) => (
          <TableRow
            key={a.id || i}
            className="odd:bg-muted/40 hover:bg-[#a8d9f9] transition-colors"
          >
            <TableCell className="font-medium">{a.id}</TableCell>
            <TableCell>{a.socio_id}</TableCell>
            <TableCell>{a.fecha}</TableCell>
            <TableCell>{a.hora_ingreso}</TableCell>
            <TableCell>{a.hora_egreso || "-"}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView && onView(a)}
              >
                Ver
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(a)}
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total de asistencias</TableCell>
          <TableCell className="text-right">{asistencias.length}</TableCell>
        </TableRow>
      </TableFooter>

      <TableCaption>Listado de asistencias registradas.</TableCaption>
    </Table>
  );
}
