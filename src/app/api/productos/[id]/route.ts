import { getProductoById } from "@/services/productoService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const producto = await getProductoById(id);
    return NextResponse.json({ data: producto }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
