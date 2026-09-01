"use client";

import { useEffect } from "react";

/**
 * Profil ochilganda ko'rishlar sonini bir marta oshiradi.
 * Sahifa ISR bilan keshlanadi, shuning uchun hisob mijoz tomonidan yuboriladi.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `yw-viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage bloklangan bo'lsa ham hisoblayveramiz.
    }

    const controller = new AbortController();
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      // Hisoblagich muhim emas — xatolik foydalanuvchiga ko'rsatilmaydi.
    });

    return () => controller.abort();
  }, [slug]);

  return null;
}
