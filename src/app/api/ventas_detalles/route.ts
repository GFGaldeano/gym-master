import { createVentaDetalle, deleteVentaDetalle, getAllVentaDetalles, updateVentaDetalle } from "@/services/ventaDetalleService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const detalles = await getAllVentaDetalles();
    return NextResponse.json({ data: detalles }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al obtener los detalles de venta" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.venta_id || !body.producto_id || !body.cantidad || !body.precio_unitario ) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }
    const detalle = await createVentaDetalle(body,body.venta_id);
    return NextResponse.json({ message: "Detalle de venta creado con éxito", data: detalle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear el detalle de venta" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { id, updateData } = await req.json();
  try {
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido para actualizar" }, { status: 400 });
    }
    const detalleModificado = await updateVentaDetalle(id, updateData);
    return NextResponse.json({ message: "Detalle de venta actualizado con éxito", data: detalleModificado }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar detalle de venta" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID inválido para eliminar" }, { status: 400 });
    }
    await deleteVentaDetalle(id);
    return NextResponse.json({ message: "Detalle de venta eliminado con éxito" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar detalle de venta" }, { status: 500 });
  }
}
