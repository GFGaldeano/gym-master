import { getActividadById } from "@/services/actividadService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const actividad = await getActividadById(id);
    return NextResponse.json({ data: actividad }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
