import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let slug: unknown;
  try {
    ({ slug } = await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await supabase.rpc("increment_candidate_view", { p_slug: slug });

  return NextResponse.json({ ok: true });
}
