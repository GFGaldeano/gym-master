import { getVentaById } from "@/services/ventaService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const venta = await getVentaById(id);
    return NextResponse.json({ data: venta }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
