"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [userType, setUserType] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      // opcional: podrías enviar userType como parte del contexto o usarlo en otro lado
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Inicio de sesión exitoso");
      router.replace("/dashboard/admin");
    } else {
      toast.error("Correo o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background gap-4">
      <div className="text-center">
        <div className="mx-auto w-70 h-70 relative">
          <Image
            src="/gm_logo.svg"
            alt="Gym Master Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="w-[400px] px-4">
        <Card className="shadow-md rounded-xl overflow-hidden w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Accedé con tu usuario y contraseña
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="userType">Tipo de Usuario</Label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="border border-input bg-background px-3 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  required
                >
                  <option value="" disabled>
                    Seleccione el tipo de usuario
                  </option>
                  <option value="administrador">Administrador</option>
                  <option value="socio">Socio</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
