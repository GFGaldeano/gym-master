import { getSocioById } from "@/services/socioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const socio = await getSocioById(id);
    return NextResponse.json({ data: socio }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
