import { getUsuarioById } from "@/services/usuarioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req:NextRequest,  { params }: { params: { id: string } }) {
    try {
    const  id  = params.id;
      const usuario = await getUsuarioById(id);
    return NextResponse.json({data:usuario},{status:200})
    
    } catch (error:any) {
        return NextResponse.json({error: error.message})
    } 
}