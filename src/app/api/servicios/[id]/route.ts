import { getServicioById } from "@/services/servicioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const servicio = await getServicioById(id);
    return NextResponse.json({ data: servicio }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
