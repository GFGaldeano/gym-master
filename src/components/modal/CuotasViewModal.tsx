"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cuota } from "@/components/tables/CuotaTable";

export default function CuotasViewModal({
  open,
  onClose,
  cuota,
}: {
  open: boolean;
  onClose: () => void;
  cuota?: Cuota | null;
}) {
  if (!cuota) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalle Cuota
          </DialogTitle>
          <div className="text-sm text-right text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <div className="p-2 border rounded-md bg-gray-50">
                {cuota.descripcion || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto</label>
              <div className="p-2 border rounded-md bg-gray-50">
                {cuota.monto || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <div className="p-2 border rounded-md bg-gray-50">
                {cuota.periodo || "-"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio</label>
              <div className="p-2 border rounded-md bg-gray-50">
                {cuota.fecha_inicio || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <div className="p-2 border rounded-md bg-gray-50">
                {cuota.fecha_fin || "-"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
