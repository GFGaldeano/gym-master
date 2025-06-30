"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OtrosGastos } from "@/components/tables/OtrosGastosTable";

export default function OtrosGastosViewModal({
  open,
  onClose,
  gasto,
}: {
  open: boolean;
  onClose: () => void;
  gasto?: OtrosGastos | null;
}) {
  if (!gasto) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalle Gasto
          </DialogTitle>
          <div className="text-right text-sm text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {gasto.descripcion || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto</label>
              <div className="border rounded-md p-2 bg-gray-50">
                ${gasto.monto}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {gasto.fecha || "-"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
