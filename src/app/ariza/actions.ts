"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import type { ApplicationState } from "./types";
import { supabase } from "@/lib/supabase/server";

/** IP manzil xom holda saqlanmaydi — faqat qaytarib bo'lmaydigan xesh. */
async function requestFingerprint() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || headerList.get("x-real-ip") || "";
  const userAgent = headerList.get("user-agent") ?? "";

  const salt = process.env.APPLICATION_IP_SALT ?? "yoshlarwiki";
  const ipHash = ip
    ? createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)
    : null;

  return { ipHash, userAgent };
}

export async function submitApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const value = (key: string) => {
    const raw = formData.get(key);
    return typeof raw === "string" ? raw.trim() : "";
  };

  // Bot tuzog'i: odam bu maydonni ko'rmaydi va to'ldirmaydi.
  if (value("website")) {
    return { status: "success", message: "Arizangiz qabul qilindi." };
  }

  const fullName = value("full_name");
  const phoneDigits = value("phone").replace(/\D/g, "");
  const telegram = value("telegram");
  const gender = value("gender");
  const ageRange = value("age_range");
  const promoCode = value("promo_code");

  if (fullName.length < 2) {
    return {
      status: "error",
      field: "full_name",
      message: "Ism familiyangizni toʻliq kiriting.",
    };
  }
  if (phoneDigits.length !== 9) {
    return {
      status: "error",
      field: "phone",
      message: "Telefon raqamni 9 ta raqamdan iborat qilib kiriting.",
    };
  }
  if (!telegram) {
    return {
      status: "error",
      field: "telegram",
      message: "Telegram username yoki ochiq telefon raqamni kiriting.",
    };
  }
  if (gender !== "ayol" && gender !== "erkak") {
    return { status: "error", field: "gender", message: "Jinsingizni tanlang." };
  }
  if (!["14_18", "19_24", "25_29", "35_plus"].includes(ageRange)) {
    return { status: "error", field: "age_range", message: "Yoshingizni tanlang." };
  }

  const { ipHash, userAgent } = await requestFingerprint();

  const { data, error } = await supabase.rpc("submit_application", {
    p_full_name: fullName,
    p_phone: `+998${phoneDigits}`,
    p_telegram: telegram,
    p_gender: gender,
    p_age_range: ageRange,
    p_promo_code: promoCode || undefined,
    p_ip_hash: ipHash ?? undefined,
    p_user_agent: userAgent,
  });

  if (error) {
    return {
      status: "error",
      message: "Server bilan bogʻlanishda xatolik. Iltimos, qayta urinib koʻring.",
    };
  }

  const result = data as unknown as {
    ok: boolean;
    error?: string;
    field?: string | null;
    message?: string;
    duplicate?: boolean;
  };

  if (!result?.ok) {
    return {
      status: "error",
      field: result?.field ?? null,
      message: result?.error ?? "Arizani yuborib boʻlmadi.",
    };
  }

  return {
    status: "success",
    duplicate: result.duplicate,
    message: result.message ?? "Arizangiz qabul qilindi.",
  };
}
