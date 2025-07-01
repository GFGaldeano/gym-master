import { getProveedorById } from "@/services/proveedorService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const proveedor = await getProveedorById(id);
    return NextResponse.json({ data: proveedor }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
