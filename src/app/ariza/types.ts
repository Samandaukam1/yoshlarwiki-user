/**
 * Ariza formasi holati.
 *
 * Bu qiymatlar `actions.ts` dan alohida turadi: "use server" fayli faqat
 * async funksiyalarni eksport qila oladi, obyekt eksporti xatolikka olib keladi.
 */

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
  field?: string | null;
  duplicate?: boolean;
};

export const initialApplicationState: ApplicationState = {
  status: "idle",
  message: "",
};
