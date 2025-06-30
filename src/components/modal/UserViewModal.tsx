"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Usuario } from "@/interfaces/usuario.interface";

export default function UserViewModal({
  open,
  onClose,
  usuario,
}: {
  open: boolean;
  onClose: () => void;
  usuario?: Usuario | null;
}) {
  if (!open || !usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 w-full max-w-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <p className="text-gray-700">
            <strong>ID:</strong> {usuario.id}
          </p>
          <p className="text-gray-700">
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {usuario.email}
          </p>
          <p className="text-gray-700">
            <strong>Rol:</strong> {usuario.rol}
          </p>
          <p className="text-gray-700">
            <strong>Estado:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                usuario.activo
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {usuario.activo ? "Activo" : "Deshabilitado"}
            </span>
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
