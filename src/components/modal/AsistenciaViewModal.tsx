"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Asistencia } from "@/interfaces/asistencia.interface";

export default function AsistenciaViewModal({
  open,
  onClose,
  asistencia,
}: {
  open: boolean;
  onClose: () => void;
  asistencia?: Asistencia | null;
}) {
  if (!open || !asistencia) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 w-full max-w-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de Asistencia</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <p className="text-gray-700">
            <strong>ID Asistencia:</strong> {asistencia.id}
          </p>
          <p className="text-gray-700">
            <strong>ID Socio:</strong> {asistencia.socio_id}
          </p>
          <p className="text-gray-700">
            <strong>Fecha:</strong> {asistencia.fecha}
          </p>
          <p className="text-gray-700">
            <strong>Hora Ingreso:</strong> {asistencia.hora_ingreso}
          </p>
          <p className="text-gray-700">
            <strong>Hora Egreso:</strong> {asistencia.hora_egreso || "-"}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
