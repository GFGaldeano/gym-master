"use client";

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

export interface Dieta {
  id_dieta: string;
  socio: string;
  objetivo: string;
  fecha: string;
}

export default function DietasTable({
  dietas,
  loading,
  onView,
  onDelete,
}: {
  dietas: Dieta[];
  loading?: boolean;
  onEdit: (dieta: Dieta) => void;
  onView?: (dieta: Dieta) => void;
  onDelete?: (dieta: Dieta) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full rounded-md h-9" />
        ))}
      </div>
    );
  }

  if (dietas.length === 0 && !loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No hay dietas registradas aún.
      </div>
    );
  }

  return (
    <Table className="w-full overflow-hidden text-sm border rounded-md border-border">
      <TableHeader>
        <TableRow className="bg-muted/50 text-muted-foreground">
          <TableHead>Socio</TableHead>
          <TableHead>Objetivo</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dietas.map((d, i) => (
          <TableRow
            key={i}
            className="odd:bg-muted/40 hover:bg-[#a8d9f9] transition-colors"
          >
            <TableCell>{d.socio}</TableCell>
            <TableCell>{d.objetivo}</TableCell>
            <TableCell>{d.fecha}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView && onView(d)}
              >
                Ver
              </Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white w-[100px]"
                onClick={() => onDelete && onDelete(d)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total de dietas</TableCell>
          <TableCell className="text-right">{dietas.length}</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption>Listado de dietas registradas.</TableCaption>
    </Table>
  );
}
