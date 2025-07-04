import { NextRequest, NextResponse } from "next/server";
import { getAvisoById, updateAviso, deleteAviso } from "@/services/avisoService";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const aviso = await getAvisoById(params.id);
    if (!aviso) return NextResponse.json({ error: "Aviso no encontrado" }, { status: 404 });
    return NextResponse.json(aviso);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const aviso = await updateAviso(params.id, body);
    return NextResponse.json(aviso);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const aviso = await deleteAviso(params.id);
    return NextResponse.json(aviso);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
