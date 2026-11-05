import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

const EXPIRA_SEGUNDOS = 600; // TEMPORÁRIO para testes (10 minutos)
const INTERVALO_REENVIO = 30; // segundos mínimos entre envios

function hashCodigo(email, codigo) {
  return crypto
    .createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(`${email}:${codigo}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Limitar reenvios seguidos
    const { data: ultimo } = await supabaseAdmin
      .from("verificacoes_email")
      .select("criado_em")
      .eq("email", email)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ultimo) {
      const passou = (Date.now() - new Date(ultimo.criado_em).getTime()) / 1000;
      if (passou < INTERVALO_REENVIO) {
        return NextResponse.json(
          { error: "Aguarda uns segundos antes de pedir outro código" },
          { status: 429 }
        );
      }
    }

    // Invalidar códigos anteriores deste email
    await supabaseAdmin
      .from("verificacoes_email")
      .update({ usado: true })
      .eq("email", email)
      .eq("usado", false);

    // Gerar código de 6 dígitos
    const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const expiraEm = new Date(Date.now() + EXPIRA_SEGUNDOS * 1000).toISOString();

    const { data: registo, error: erroInsert } = await supabaseAdmin
      .from("verificacoes_email")
      .insert({
        email,
        codigo_hash: hashCodigo(email, codigo),
        expira_em: expiraEm,
      })
      .select("id")
      .single();

    if (erroInsert) {
      console.error(erroInsert);
      return NextResponse.json({ error: "Erro ao gerar código" }, { status: 500 });
    }

    // Enviar email
    const { error: erroEnvio } = await resend.emails.send({
      from: "CasaExpress <noreply@casaexpress.fun>",
      to: email,
      subject: `${codigo} é o teu código CasaExpress`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:24px">
          <h2 style="color:#1e40af;margin:0 0 8px">Casa<span style="color:#2563eb">Express</span></h2>
          <p style="color:#374151">O teu código de verificação é:</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111827;margin:16px 0">${codigo}</p>
          <p style="color:#6b7280;font-size:13px">Este código expira em ${EXPIRA_SEGUNDOS} segundos. Se não pediste este código, ignora este email.</p>
        </div>
      `,
    });

    if (erroEnvio) {
      console.error(erroEnvio);
      await supabaseAdmin.from("verificacoes_email").delete().eq("id", registo.id);
      return NextResponse.json({ error: "Não foi possível enviar o email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, expiraSegundos: EXPIRA_SEGUNDOS });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}