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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const ejerciciosPorDia: Record<
  string,
  { name: string; sets: number; reps: number | string; gif?: string }[]
> = {
  Lunes: [
    {
      name: "Bench Press",
      sets: 4,
      reps: 10,
      gif: "https://i.pinimg.com/originals/f1/52/16/f15216ce06438b9ee776941c4f74dc6e.gif",
    },
    {
      name: "Incline Dumbbell Press",
      sets: 3,
      reps: 12,
      gif: "https://i.pinimg.com/originals/6e/8e/2b/6e8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
  ],
  Martes: [
    {
      name: "Deadlift",
      sets: 4,
      reps: 8,
      gif: "https://i.pinimg.com/originals/7b/6e/2e/7b6e2e2b1e4b8e8e2b3e2b1e4b8e8e2b.gif",
    },
    {
      name: "Lat Pulldown",
      sets: 3,
      reps: 10,
      gif: "https://i.pinimg.com/originals/8c/8e/2b/8c8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
  ],
  Miércoles: [
    {
      name: "Squats",
      sets: 4,
      reps: 10,
      gif: "https://i.pinimg.com/originals/9d/8e/2b/9d8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
    {
      name: "Leg Press",
      sets: 3,
      reps: 12,
      gif: "https://i.pinimg.com/originals/1a/8e/2b/1a8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
  ],
  Jueves: [
    {
      name: "Overhead Press",
      sets: 4,
      reps: 10,
      gif: "https://i.pinimg.com/originals/2b/8e/2b/2b8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
    {
      name: "Lateral Raises",
      sets: 3,
      reps: 15,
      gif: "https://i.pinimg.com/originals/3c/8e/2b/3c8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
  ],
  Viernes: [
    {
      name: "Bicep Curls",
      sets: 3,
      reps: 12,
      gif: "https://i.pinimg.com/originals/4d/8e/2b/4d8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
    {
      name: "Tricep Extensions",
      sets: 3,
      reps: 12,
      gif: "https://i.pinimg.com/originals/5e/8e/2b/5e8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
  ],
  Sábado: [
    {
      name: "Plank",
      sets: 3,
      reps: "60s",
      gif: "https://i.pinimg.com/originals/6f/8e/2b/6f8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
    {
      name: "Russian Twists",
      sets: 3,
      reps: 20,
      gif: "https://i.pinimg.com/originals/7a/8e/2b/7a8e2b3e2b1e4b8e8e2b3e2b1e4b8e8e.gif",
    },
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
  const [exportando, setExportando] = useState(false);

  const handleExportarPDF = async () => {
    setExportando(true);
    const content: any[] = [
      { text: "Ejercicios por día", style: "header", margin: [0, 0, 0, 10] },
    ];
    for (const dia of dias) {
      content.push({ text: dia, style: "subheader", margin: [0, 10, 0, 4] });
      if (ejerciciosPorDia[dia] && ejerciciosPorDia[dia].length > 0) {
        const tableBody = [
          ["Ejercicio", "Series", "Repeticiones"],
          ...ejerciciosPorDia[dia].map((ej) => [
            ej.name,
            ej.sets.toString(),
            ej.reps.toString(),
          ]),
        ];
        content.push({
          table: { body: tableBody },
          layout: "lightHorizontalLines",
        });
      } else {
        content.push({ text: "Descanso", italics: true });
      }
    }
    pdfMake
      .createPdf({
        content,
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 14, bold: true },
        },
        defaultStyle: { font: "Roboto" },
        fonts: {
          Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Medium.ttf",
            italics: "Roboto-Italic.ttf",
            bolditalics: "Roboto-MediumItalic.ttf",
          },
        },
      })
      .download("ejercicios.pdf");
    setExportando(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Ejercicios por día
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end mb-2">
          <Button onClick={handleExportarPDF} disabled={exportando}>
            {exportando ? "Exportando..." : "Exportar a PDF"}
          </Button>
        </div>
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
                                src={ej.gif}
                                alt="gif ejercicio"
                                className="w-full h-auto max-w-xs rounded-md"
                              />
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setGifEjercicio(null)}
                                >
                                  Cerrar
                                </Button>
                                <a
                                  href={ej.gif}
                                  download={`ejercicio-${ej.name}.gif`}
                                  className="inline-block"
                                >
                                  <Button size="sm" variant="outline">
                                    Descargar GIF
                                  </Button>
                                </a>
                              </div>
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
                <div className="p-2 border rounded-md bg-muted text-foreground border-border">
                  {rutina.socio || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Objetivo
                </label>
                <div className="p-2 border rounded-md bg-muted text-foreground border-border">
                  {rutina.objetivo || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nivel
                </label>
                <div className="p-2 border rounded-md bg-muted text-foreground border-border">
                  {rutina.nivel || "-"}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Fecha
                </label>
                <div className="p-2 border rounded-md bg-muted text-foreground border-border">
                  {rutina.fecha || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Días
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-muted text-foreground border-border">
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
