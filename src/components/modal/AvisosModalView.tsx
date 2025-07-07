"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Aviso } from "@/components/tables/AvisosTable";

export default function AvisosModalView({
  open,
  onClose,
  aviso,
}: {
  open: boolean;
  onClose: () => void;
  aviso?: Aviso | null;
}) {
  if (!aviso) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detalle Aviso
          </DialogTitle>
          <div className="text-right text-sm text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asunto</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {aviso.asunto || "-"}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Día enviado</label>
              <div className="border rounded-md p-2 bg-gray-50">
                {aviso.dia_enviado || "-"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
