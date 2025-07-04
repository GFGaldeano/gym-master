import {  obtenerSociosDeudores } from "@/lib/brevo";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const deudores = await obtenerSociosDeudores();
   return NextResponse.json({message:"Obteniendo socios con la cuota vencida", data:deudores},{status:200});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
