"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { AppHeader } from "@/components/header/AppHeader";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import dynamic from "next/dynamic";
const FechaHora = dynamic(() => import("@/components/ui/FechaHora"), { ssr: false });

const asistenciaPorDia = [
  { name: "Lun", socios: 40 },
  { name: "Mar", socios: 35 },
  { name: "Mié", socios: 52 },
  { name: "Jue", socios: 47 },
  { name: "Vie", socios: 63 },
  { name: "Sáb", socios: 70 },
  { name: "Dom", socios: 30 },
];

const actividadesData = [
  { name: "Musculación", value: 400 },
  { name: "Crossfit", value: 300 },
  { name: "Yoga", value: 200 },
  { name: "Spinning", value: 180 },
  { name: "Boxeo", value: 220 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />

        <div className="flex-1 flex flex-col w-full">
          <AppHeader title="Dashboard" />

          <main className="flex-1 px-4 md:px-8 py-6 space-y-6 w-full max-w-full">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Socios Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">120</div>
                  <p className="text-sm text-muted-foreground">Socios registrados actualmente</p>
                  <p className="text-sm text-green-500 mt-1">+8 nuevos esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">Tipos de actividades en el gimnasio</p>
                  <p className="text-sm text-foreground mt-1">≈ Sin cambios</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Entrenadores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                  <p className="text-sm text-muted-foreground">Entrenadores disponibles</p>
                  <p className="text-sm text-green-500 mt-1">↑ +1 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Clases Semanales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">36</div>
                  <p className="text-sm text-muted-foreground">Total de clases esta semana</p>
                  <p className="text-sm text-green-500 mt-1">↑ +10% asistencia</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
              <Card className="col-span-12 lg:col-span-8">
                <CardHeader>
                  <CardTitle>Asistencias por Día</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={asistenciaPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="socios"
                        stroke="#02a8e1"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-12 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Distribución por Actividad</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={actividadesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {actividadesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
