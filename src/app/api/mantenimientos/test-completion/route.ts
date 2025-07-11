import { NextRequest, NextResponse } from "next/server";
import { updateMantenimiento } from "@/services/mantenimientoService";

/**
 * API endpoint to test maintenance completion functionality
 * This demonstrates how the automatic equipment updates work when maintenance is completed
 */
export async function POST(req: NextRequest) {
    try {
        const { maintenanceId, fechaCompletado } = await req.json();
        
        if (!maintenanceId) {
            return NextResponse.json({ 
                error: "Se requiere el ID del mantenimiento" 
            }, { status: 400 });
        }

        // Update maintenance to completed status
        const updatedMaintenance = await updateMantenimiento(maintenanceId, {
            estado: 'completado',
            fecha_mantenimiento: fechaCompletado || new Date().toISOString().split('T')[0]
        });

        return NextResponse.json({
            message: "Mantenimiento completado y equipamiento actualizado automáticamente",
            data: {
                maintenance: updatedMaintenance,
                automaticUpdates: {
                    equipmentStatus: "operativo",
                    ultimaRevision: updatedMaintenance.fecha_mantenimiento,
                    proximaRevision: "3 meses después de la fecha de completado"
                }
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error testing maintenance completion:", error.message);
        return NextResponse.json({ 
            error: "Error al completar mantenimiento: " + error.message 
        }, { status: 500 });
    }
}