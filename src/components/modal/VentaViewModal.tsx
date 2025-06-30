"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Venta } from "@/components/tables/VentaTable";

export default function VentaViewModal({
  open,
  onClose,
  venta,
}: {
  open: boolean;
  onClose: () => void;
  venta?: Venta | null;
}) {
  if (!venta) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalle Venta
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
                {venta.socio_id || "-"}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {venta.fecha || "-"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Total</label>
              <div className="border rounded-md p-2 bg-gray-50">
                ${venta.total}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
