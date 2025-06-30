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

export interface Pago {
  id: string;
  socio_id: string;
  cuota_id: string;
  fecha_pago: string;
  fecha_vencimiento: string;
  monto_pagado: number;
  total: number;
  registrado_por: string;
}

export default function PagoTable({
  pagos,
  loading,
  onEdit,
  onView,
  onDelete,
}: {
  pagos: Pago[];
  loading?: boolean;
  onEdit: (pago: Pago) => void;
  onView?: (pago: Pago) => void;
  onDelete?: (pago: Pago) => void;
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

  if (pagos.length === 0 && !loading) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No hay pagos registrados aún.
      </div>
    );
  }

  return (
    <Table className="w-full text-sm border border-border rounded-md overflow-hidden">
      <TableHeader>
        <TableRow className="bg-muted/50 text-muted-foreground">
          <TableHead>Socio</TableHead>
          <TableHead>Cuota</TableHead>
          <TableHead>Fecha Pago</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead>Monto Pagado</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Registrado Por</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pagos.map((p, i) => (
          <TableRow
            key={i}
            className="odd:bg-muted/40 hover:bg-[#a8d9f9] transition-colors"
          >
            <TableCell className="font-medium">{p.socio_id}</TableCell>
            <TableCell>{p.cuota_id}</TableCell>
            <TableCell>{p.fecha_pago}</TableCell>
            <TableCell>{p.fecha_vencimiento}</TableCell>
            <TableCell>${p.monto_pagado}</TableCell>
            <TableCell>${p.total}</TableCell>
            <TableCell>{p.registrado_por}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView && onView(p)}
              >
                Ver
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(p)}
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white w-[100px]"
                onClick={() => onDelete && onDelete(p)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total de pagos</TableCell>
          <TableCell className="text-right">{pagos.length}</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption>Listado de pagos registrados.</TableCaption>
    </Table>
  );
}
