import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

/**
 * Ommaviy sayt uchun Supabase mijozi.
 *
 * Foydalanuvchi sessiyasi yo'q — barcha o'qishlar anon kalit bilan, RLS
 * himoyasi ostida bajariladi. Cookie ishlatilmagani uchun sahifalar statik
 * yoki ISR rejimida render qilinishi mumkin.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY .env faylida belgilanishi shart.",
  );
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { "x-application-name": "yoshlarwiki-user" } },
});

export type SupabaseClient = typeof supabase;
