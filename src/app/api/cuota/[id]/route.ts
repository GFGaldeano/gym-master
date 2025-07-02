import { getCuotaById } from "@/services/cuotaService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const cuota = await getCuotaById(id);
    return NextResponse.json({ data: cuota }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
