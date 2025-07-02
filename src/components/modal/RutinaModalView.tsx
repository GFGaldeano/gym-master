"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rutina } from "@/components/tables/RutinasTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ejerciciosPorDia: Record<
  string,
  { name: string; sets: number; reps: number | string }[]
> = {
  Lunes: [
    { name: "Bench Press", sets: 4, reps: 10 },
    { name: "Incline Dumbbell Press", sets: 3, reps: 12 },
  ],
  Martes: [
    { name: "Deadlift", sets: 4, reps: 8 },
    { name: "Lat Pulldown", sets: 3, reps: 10 },
  ],
  Miércoles: [
    { name: "Squats", sets: 4, reps: 10 },
    { name: "Leg Press", sets: 3, reps: 12 },
  ],
  Jueves: [
    { name: "Overhead Press", sets: 4, reps: 10 },
    { name: "Lateral Raises", sets: 3, reps: 15 },
  ],
  Viernes: [
    { name: "Bicep Curls", sets: 3, reps: 12 },
    { name: "Tricep Extensions", sets: 3, reps: 12 },
  ],
  Sábado: [
    { name: "Plank", sets: 3, reps: "60s" },
    { name: "Russian Twists", sets: 3, reps: 20 },
  ],
  Domingo: [],
};

function EjerciciosModal({
  open,
  onClose,
  dias,
}: {
  open: boolean;
  onClose: () => void;
  dias: string[];
}) {
  const [gifEjercicio, setGifEjercicio] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Ejercicios por día
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            {dias.map((dia) => (
              <AccordionItem key={dia} value={dia}>
                <AccordionTrigger className="text-base text-foreground">
                  {dia}
                </AccordionTrigger>
                <AccordionContent>
                  {ejerciciosPorDia[dia] && ejerciciosPorDia[dia].length > 0 ? (
                    <ul className="space-y-3">
                      {ejerciciosPorDia[dia].map((ej, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <span className="font-medium text-foreground">
                              {ej.name}
                            </span>
                            <span className="text-sm text-foreground">
                              Series: {ej.sets}
                            </span>
                            <span className="text-sm text-foreground">
                              Reps: {ej.reps}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setGifEjercicio(`${dia}-${idx}`)}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          {gifEjercicio === `${dia}-${idx}` && (
                            <div className="flex flex-col items-center w-full mt-2">
                              <img
                                src="https://i.pinimg.com/originals/f1/52/16/f15216ce06438b9ee776941c4f74dc6e.gif"
                                alt="gif ejercicio"
                                className="w-full h-auto max-w-xs rounded-md"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => setGifEjercicio(null)}
                              >
                                Cerrar
                              </Button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground">Descanso</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RutinaModalView({
  open,
  onClose,
  rutina,
}: {
  open: boolean;
  onClose: () => void;
  rutina?: Rutina | null;
}) {
  const [modalEjercicios, setModalEjercicios] = useState(false);

  if (!rutina) return null;

  const diasRutina = rutina.dias.split(",").map((d) => d.trim());

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="!max-w-[90vw] sm:!max-w-[800px] !w-full bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Detalle Rutina
            </DialogTitle>
            <div className="text-sm text-right text-muted-foreground">
              {new Date().toLocaleString()}
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Socio
                </label>
                <div className="p-2 border rounded-md bg-background text-foreground border-border">
                  {rutina.socio || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Objetivo
                </label>
                <div className="p-2 border rounded-md bg-background text-foreground border-border">
                  {rutina.objetivo || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nivel
                </label>
                <div className="p-2 border rounded-md bg-background text-foreground border-border">
                  {rutina.nivel || "-"}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Fecha
                </label>
                <div className="p-2 border rounded-md bg-background text-foreground border-border">
                  {rutina.fecha || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Días
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background text-foreground border-border">
                  <span className="truncate">{rutina.dias || "-"}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setModalEjercicios(true)}
                  >
                    Ver ejercicios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EjerciciosModal
        open={modalEjercicios}
        onClose={() => setModalEjercicios(false)}
        dias={diasRutina}
      />
    </>
  );
}
