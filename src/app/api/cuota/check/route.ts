import { actualizarEstadosCuotasVencidas } from "@/services/cuotaService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cuotas = await actualizarEstadosCuotasVencidas();
    if(!cuotas) return NextResponse.json({message:"error"},{status:400})

    
    if(cuotas.length === 0) {
    return NextResponse.json({message:"No hay cuotas vencidas"}, { status: 200 });
    } 
    return NextResponse.json({message:"checkeo de cuotas vencidas", data: cuotas }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}