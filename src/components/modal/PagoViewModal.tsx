"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pago } from "@/components/tables/PagoTable";

export default function PagoViewModal({
  open,
  onClose,
  pago,
}: {
  open: boolean;
  onClose: () => void;
  pago?: Pago | null;
}) {
  if (!pago) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalle Pago
          </DialogTitle>
          <div className="text-right text-sm text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Socio</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {pago.socio_id || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cuota</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {pago.cuota_id || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Pago</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {pago.fecha_pago || "-"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto Pagado</label>
              <div className="border rounded-md p-2 bg-gray-50">
                ${pago.monto_pagado}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registrado Por</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {pago.registrado_por || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total</label>
              <div className="border rounded-md p-2 bg-gray-50">
                ${pago.total}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
