"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Socio } from "@/components/tables/SociosTable";

export default function SocioViewModal({
  open,
  onClose,
  socio,
}: {
  open: boolean;
  onClose: () => void;
  socio?: Socio | null;
}) {
  if (!socio) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detalle Socio</DialogTitle>
          <div className="text-right text-sm text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre completo</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.nombre_completo || "-"}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">DNI</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.dni || "-"}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.direccion || "-"}</div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.telefono || "-"}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.email || "-"}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Alta</label>
              <div className="border rounded-md p-2 bg-gray-50">{socio.fecha_alta || "-"}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
