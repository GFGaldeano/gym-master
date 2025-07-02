import { getPagoById } from "@/services/pagoService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const pago = await getPagoById(id);
    return NextResponse.json({ data: pago }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
