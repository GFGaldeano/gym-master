import * as brevo from "@getbrevo/brevo"
import { getAllPagos } from "@/services/pagoService";
import { fetchSocios } from "@/services/socioService";
import { actualizarEstadosCuotasVencidas, getAllCuotas } from "@/services/cuotaService";
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


export async function sendEmail({to, subject, htmlContent}: brevoEmail) {        
smtpEmail.subject= subject;
smtpEmail.to= to;
smtpEmail.htmlContent= htmlContent
console.log("envio mail");

smtpEmail.sender={ name:"Gym Master", 
    email:"gym-master@adminsitracion.com"} //FALTA CREAR EL EMAIL
try {
  const response = await apiInstance.sendTransacEmail(smtpEmail);
  //console.log("Respuesta de Brevo:", response);
} catch (error) {
  console.error("Error enviando email:", error);
}}

  
/*
export async function obtenerSociosDeudores() {
  const hoy = new Date().toISOString().slice(0, 10);

  // 1. Obtener la última cuota activa
  const { data: ultimaCuota, error: errorCuota } = await supabase
    .from('cuota')
    .select()
    .eq('activo', true)
    .order('creado_en', { ascending: false })
    .limit(1)
    .single();

  if (errorCuota || !ultimaCuota) {
    console.error('No se encontró cuota vencida activa');
    return [];
  }

  // Verificar que la cuota esté vencida
  if (dayjs(ultimaCuota.fecha_fin).isAfter(dayjs(hoy))) {
    console.log('La última cuota aún no está vencida.');
    return [];
  }

  // 2. Obtener todos los socios activos
  const { data: socios, error: errorSocios } = await supabase
    .from('socio')
    .select()
    .eq('activo', true);

  if (errorSocios || !socios) {
    console.error('No se encontraron socios');
    return [];
  }

  // 3. Buscar los socios que NO tienen pago de la última cuota
  const sociosDeudores: any[] = [];

  for (const socio of socios) {
    const { data: pago, error: errorPago } = await supabase
      .from('pago')
      .select()
      .eq('cuota_id', ultimaCuota.id)
      .eq('socio_id', socio.id_socio)
      .single();

    if (!pago) {
      console.log(`Socio ${socio.nombre_completo} (${socio.id_socio}) no tiene pago de la última cuota.`);
      sociosDeudores.push(socio);

      // Enviar email de aviso de deuda solo si la cuota está vencida
      if (dayjs(ultimaCuota.fecha_fin).isBefore(dayjs(hoy))) {
        if (socio.email) {
          const subject = "Aviso de cuota pendiente en Gym Master";
          const htmlContent = `<p>Hola ${socio.nombre_completo},</p>
            <p>Detectamos que tienes una cuota pendiente correspondiente al mes de <b>${dayjs(ultimaCuota.fecha_inicio).format('MMMM YYYY')}</b>.</p>
            <p>Por favor, regulariza tu situación para evitar la suspensión de tu membresía.</p>
            <p>Si ya realizaste el pago, por favor ignora este mensaje.</p>
            <br><p>Saludos,<br>Equipo Gym Master</p>`;
          try {
            if(socio.email === "agusmalugani97@gmail.com"){
              console.log("Enviando email de prueba a Agus");
               await sendEmail({
                 to: [{ email: socio.email, name: socio.nombre_completo }],
                 subject,
                 htmlContent
                 });
            }
            console.log(`Email enviado a ${socio.email}`);
          } catch (error) {
            console.error(`Error enviando email a ${socio.email}:`, error);
          }
        } else {
          console.log(`Socio ${socio.nombre_completo} no tiene email registrado.`);
        }
      }
    }
  }

  return sociosDeudores;
}
*/
export async function obtenerSociosDeudores() {
  const hoy = new Date().toISOString().slice(0, 10);

  // todos los socios activos
  const { data: socios, error: errorSocios } = await supabase
    .from('socio')
    .select()
    .eq('activo', true);

  if (errorSocios || !socios) {
    console.error('No se encontraron socios');
    return [];
  }

  const sociosDeudores: any[] = [];

  for (const socio of socios) {
    // ultimo pago del socio
    const { data: ultimoPago, error: errorPago } = await supabase
      .from('pago')
      .select()
      .eq('socio_id', socio.id_socio)
      .order('fecha_vencimiento', { ascending: false })
      .limit(1)
      .single();

    if (errorPago || !ultimoPago) {
      console.log(`Socio ${socio.nombre_completo} (${socio.id_socio}) no tiene pagos registrados.`);
      continue;
    }

    // Verificar si el último pago está vencido
    if (dayjs(ultimoPago.fecha_vencimiento).isBefore(dayjs(hoy))) {
      console.log(`Socio ${socio.nombre_completo} (${socio.id_socio}) tiene un pago vencido.`);
      sociosDeudores.push(socio);

      // Enviar email de aviso de deuda
      if (socio.email) {
        const subject = "Aviso de cuota pendiente en Gym Master";
        const htmlContent = `<p>Hola ${socio.nombre_completo},</p>
          <p>Detectamos que tienes un pago vencido con fecha de vencimiento <b>${dayjs(ultimoPago.fecha_vencimiento).format('DD/MM/YYYY')}</b>.</p>
          <p>Por favor, regulariza tu situación para evitar la suspensión de tu membresía.</p>
          <p>Si ya realizaste el pago, por favor ignora este mensaje.</p>
          <br><p>Saludos,<br>Equipo Gym Master</p>`;
        try {
        //  await sendEmail({
        //    to: [{ email: socio.email, name: socio.nombre_completo }],
        //    subject,
        //    htmlContent,
        //  });
          console.log(`Email enviado a ${socio.email}`);
        } catch (error) {
          console.error(`Error enviando email a ${socio.email}:`, error);
        }
      } else {
        console.log(`Socio ${socio.nombre_completo} no tiene email registrado.`);
      }
    }
  }

  return sociosDeudores;
}



