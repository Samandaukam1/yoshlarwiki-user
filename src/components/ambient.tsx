/**
 * Liquid glass kartalar ortidagi sekin suzuvchi rangli nur dog'lari.
 * Shisha effekti faqat ortida rang bo'lsagina ko'rinadi — glass kartalar
 * turgan sahifalarga qo'yiladi. (Uslublar: globals.css → .yw-ambient)
 */
export function Ambient() {
  return (
    <div className="yw-ambient" aria-hidden>
      <span />
      <span />
      <span />
    </div>
  );
}
