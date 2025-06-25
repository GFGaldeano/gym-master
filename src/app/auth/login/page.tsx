"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersSystem = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial = saved ? saved === "dark" : prefersSystem;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { dark, toggle };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [loading, setLoading] = useState(false);
  const { dark, toggle } = useDarkMode();

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
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Inicio de sesión exitoso");
      router.replace("/dashboard");
    } else {
      toast.error("Correo o contraseña incorrectos");
    }

    setLoading(false);
  };

  return (
    <div className="flex relative inset-0 flex-col gap-4 justify-center items-center bg-background">
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={toggle}
                aria-label="Cambiar modo claro/oscuro"
              >
                {dark ? (
                  <Moon className="size-7" />
                ) : (
                  <Sun className="size-7" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {dark ? "Modo claro" : "Modo oscuro"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="text-center">
        <div className="relative mx-auto w-70 h-70">
          <Image
            src="/gm_logo.svg"
            alt="Gym Master Logo"
            fill
            className="object-contain dark:invert"
            priority
          />
        </div>
      </div>

      <div className="w-[400px] px-4">
        <Card className="overflow-hidden w-full rounded-xl shadow-md">
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
                  className="px-3 py-2 text-sm rounded-md border shadow-sm border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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

              <Button type="submit" className="mt-2 w-full" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
