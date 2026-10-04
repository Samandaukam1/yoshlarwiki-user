/** 12345 → "12 345" (bo'linmas bo'shliq bilan — qator uzilmaydi). */
export function formatNumber(value: number): string {
  return Math.max(0, Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Raqamlarni "musobaqa" usulida o'ringa aylantiradi: teng qiymatlar bir xil
 * o'rinni oladi, keyingisi esa o'tkazib yuboriladi (1, 2, 2, 4 …).
 * Ro'yxat kamayish tartibida bo'lishi kerak.
 */
export function competitionRanks(values: number[]): number[] {
  const ranks: number[] = [];
  values.forEach((value, index) => {
    ranks.push(index > 0 && value === values[index - 1] ? ranks[index - 1] : index + 1);
  });
  return ranks;
}
