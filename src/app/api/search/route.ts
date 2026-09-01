import { NextResponse } from "next/server";

import { quickSearch } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2 || query.length > 80) {
    return NextResponse.json({ candidates: [], categories: [] });
  }

  const results = await quickSearch(query);

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
