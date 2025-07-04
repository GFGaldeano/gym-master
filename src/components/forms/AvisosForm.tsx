"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const emptyForm = {
  asunto: "",
  cuerpo: "",
};

export default function AvisosForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm(emptyForm);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="asunto">Asunto</Label>
        <Input
          id="asunto"
          name="asunto"
          placeholder="Ingrese asunto"
          value={form.asunto}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cuerpo">Cuerpo del mail</Label>
        <textarea
          id="cuerpo"
          name="cuerpo"
          placeholder="Ingrese el cuerpo del mail"
          value={form.cuerpo}
          onChange={handleChange}
          required
          rows={6}
          className="resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px]"
        />
      </div>
      <Button type="submit" className="justify-self-end" disabled={loading}>
        {loading ? "Enviando..." : "Enviar Aviso"}
      </Button>
    </form>
  );
}
