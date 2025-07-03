import * as brevo from "@getbrevo/brevo"
import { getAllPagos } from "@/services/pagoService";
import { fetchSocios } from "@/services/socioService";
import { getAllCuotas } from "@/services/cuotaService";
import dayjs from "dayjs";
import { supabase } from "@/services/supabaseClient";

const apiInstance = new brevo.TransactionalEmailsApi;

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
     process.env.BREVO_API_KEY as string )

     const smtpEmail = new brevo.SendSmtpEmail()

     interface brevoEmail{
     to: {email:string, name:string}[],
      subject: string,
       htmlContent: string
     }

export async function sendCuotaAlerts() {
  const cuotas = await getAllCuotas(); // cuotas activas
  //const socios = await fetchSocios(); // socios activos
  const pagos = await getAllPagos(); // todos los pagos
  const hoy = dayjs();

  //for (const socio of socios) {// por cada socio
  const socio =  {
        id_socio: "2c2af6cb-1e8d-4557-8c69-9ffe76a5afa7",
        usuario_id: "3f6105ee-0325-46bc-b142-68c9fa597cdf",
        nombre_completo: "Aitana Granados Montero",
        dni: "88288171",
        direccion: "Vial Carmen Aznar 4 Puerta 1 , Salamanca, 66392",
        telefono: "+34938516709",
        activo: true,
        fecha_alta: "2025-06-07",
        fecha_baja: null,
        creado_en: "2025-06-07T11:48:19.061356"
    }
    for (const cuota of cuotas) {
      // Buscamos si existe un pago para este socio y esta cuota
      const pago = pagos.find(pago => 
        pago.socio.id_socio === socio.id_socio && //veo si hay un pago para ese socio
        pago.cuota.id === cuota.id); // y verifico que el pago sea de la cuota que itero

      const montoPagado = pago ? pago.monto_pagado : 0; //si esta pagado tiene el monto, si no 0
      const fechaVencimiento = cuota.fecha_fin;

       
        
      // Si la cuota está vencida y no está pagada
      if (dayjs(fechaVencimiento).isBefore(hoy) && montoPagado < cuota.monto) {
            await sendEmail({
         // to: [{ email: socio.email, name: socio.nombre_completo }],
         to: [{ email: "agusmalugan@gmail.com", name: socio.nombre_completo }],
          subject: "Aviso de cuota vencida",
          htmlContent: `<p>Estimado ${socio.nombre_completo}, su cuota venció el ${fechaVencimiento} y aún registra deuda. Por favor regularice su situación.</p>`
        });
      }

      // Si pasaron más de 7 días desde el vencimiento y no está pagada
      if (dayjs(fechaVencimiento).add(7, 'day').isBefore(hoy) && montoPagado < cuota.monto) {
        await sendEmail({
          //to: [{ email: socio.email, name: socio.nombre_completo }],
          to: [{ email: "agusmalug@gmail.com", name: socio.nombre_completo }],
          subject: "Aviso de inactividad",
          htmlContent: `<p>Estimado ${socio.nombre_completo}, han pasado más de 7 días desde el vencimiento de su cuota y su cuenta será dada de baja temporalmente.</p>`
        });
      }
    }
  //}
}

 export async function sendEmail({to, subject, htmlContent}: brevoEmail) {        
smtpEmail.subject= subject;
smtpEmail.to= to;
smtpEmail.htmlContent= htmlContent
console.log("envio mail");

smtpEmail.sender={ name:"Nombre Remitente", 
    email:"agusmalugani97@gmail.com"} //cambiar
try {
  const response = await apiInstance.sendTransacEmail(smtpEmail);
  //console.log("Respuesta de Brevo:", response);
} catch (error) {
  console.error("Error enviando email:", error);
}
     }

     export interface SocioCuotaPendiente {
      socio_id: string;
      nombre_completo: string;
      email: string;
      cuota: {
        descripcion: string;
        monto: number;
        estado: string;
        fecha_vencimiento: string;
      };
    }
    
    export async function getSociosConCuotasVencidas(): Promise<SocioCuotaPendiente[]> {
      const { data, error } = await supabase
        .from("socio_cuota")
        .select(`
          socio: socio_id (id_socio, nombre_completo, email, activo),
          cuota: cuota_id (descripcion, monto),
          estado,
          fecha_vencimiento
        `)
        .in("estado", ["vencida"]);
    
      if (error) throw new Error(error.message);
      if (!data) return [];
    
      // Filtrar solo socios activos y mapear la estructura
      return data
        .filter((row: any) => row.socio && row.socio.activo)
        .map((row: any) => ({
          socio_id: row.socio.id_socio,
          nombre_completo: row.socio.nombre_completo,
          email: row.socio.email,
          cuota: {
            descripcion: row.cuota.descripcion,
            monto: row.cuota.monto,
            estado: row.estado,
            fecha_vencimiento: row.fecha_vencimiento
          }
        }));
    }