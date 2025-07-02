"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface RutinaFormValues {
  socio: string;
  objetivo: string;
  nivel: string;
  dias: string;
}

export default function RutinasForm({
  initialValues,
  onSubmit,
  loading,
}: {
  initialValues?: RutinaFormValues;
  onSubmit: (values: RutinaFormValues) => void;
  loading?: boolean;
}) {
  const [values, setValues] = useState<RutinaFormValues>(
    initialValues || {
      socio: "",
      objetivo: "",
      nivel: "",
      dias: "",
    }
  );

  const handleChange = (field: keyof RutinaFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="flex flex-col gap-1.5">
        <Label>Socio</Label>
        <Input
          className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          value={values.socio}
          onChange={(e) => handleChange("socio", e.target.value)}
          placeholder="Nombre del socio"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Objetivo</Label>
        <Input
          className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          value={values.objetivo}
          onChange={(e) => handleChange("objetivo", e.target.value)}
          placeholder="Ejemplo: Hipertrofia"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Nivel</Label>
        <Input
          className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          value={values.nivel}
          onChange={(e) => handleChange("nivel", e.target.value)}
          placeholder="Ejemplo: Intermedio"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Días</Label>
        <Input
          className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          type="number"
          value={values.dias}
          onChange={(e) => handleChange("dias", e.target.value)}
          placeholder="Cantidad de días"
          min={1}
          required
        />
      </div>
      <Button
        type="submit"
        className="col-span-full justify-self-end"
        disabled={loading}
      >
        Guardar rutina
      </Button>
    </form>
  );
}
