import { sendCuotaAlerts } from "@/lib/brevo";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await sendCuotaAlerts();
    return NextResponse.json({ message: "Alertas enviadas correctamente" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
