import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const MAX_TENTATIVAS = 5;

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
    const codigo = String(body.codigo || "").trim();

    if (!/\S+@\S+\.\S+/.test(email) || !/^\d{6}$/.test(codigo)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Último código ainda não usado deste email
    const { data: registo } = await supabaseAdmin
      .from("verificacoes_email")
      .select("*")
      .eq("email", email)
      .eq("usado", false)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!registo) {
      return NextResponse.json(
        { error: "Código inválido ou expirado. Pede um novo." },
        { status: 400 }
      );
    }

    if (new Date(registo.expira_em).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "O código expirou. Pede um novo." },
        { status: 400 }
      );
    }

    if (registo.tentativas >= MAX_TENTATIVAS) {
      return NextResponse.json(
        { error: "Demasiadas tentativas. Pede um novo código." },
        { status: 429 }
      );
    }

    // Comparar hashes
    const esperado = Buffer.from(registo.codigo_hash, "hex");
    const recebido = Buffer.from(hashCodigo(email, codigo), "hex");
    const correto =
      esperado.length === recebido.length &&
      crypto.timingSafeEqual(esperado, recebido);

    if (!correto) {
      await supabaseAdmin
        .from("verificacoes_email")
        .update({ tentativas: registo.tentativas + 1 })
        .eq("id", registo.id);

      return NextResponse.json({ error: "Código incorreto" }, { status: 400 });
    }

    // Código certo: marcar como usado
    await supabaseAdmin
      .from("verificacoes_email")
      .update({ usado: true })
      .eq("id", registo.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}