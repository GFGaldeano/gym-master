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

export interface Venta {
  id: string;
  socio_id: string;
  total: number;
  fecha: string;
}

export default function VentaTable({
  ventas,
  loading,
  onEdit,
  onView,
  onDelete,
}: {
  ventas: Venta[];
  loading?: boolean;
  onEdit: (venta: Venta) => void;
  onView?: (venta: Venta) => void;
  onDelete?: (venta: Venta) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (ventas.length === 0 && !loading) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No hay ventas registradas aún.
      </div>
    );
  }

  return (
    <Table className="w-full text-sm border border-border rounded-md overflow-hidden">
      <TableHeader>
        <TableRow className="bg-muted/50 text-muted-foreground">
          <TableHead>Socio</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ventas.map((v, i) => (
          <TableRow
            key={i}
            className="odd:bg-muted/40 hover:bg-[#a8d9f9] transition-colors"
          >
            <TableCell className="font-medium">{v.socio_id}</TableCell>
            <TableCell>${v.total}</TableCell>
            <TableCell>{v.fecha}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView && onView(v)}
              >
                Ver
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(v)}
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white w-[100px]"
                onClick={() => onDelete && onDelete(v)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total de ventas</TableCell>
          <TableCell className="text-right">{ventas.length}</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption>Listado de ventas registradas.</TableCaption>
    </Table>
  );
}
