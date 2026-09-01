"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Blok ekranga kirganda yumshoq paydo bo'ladi.
 *
 * IntersectionObserver bir marta ishlaydi va o'chadi — skroll paytida
 * qo'shimcha hisob-kitob bo'lmaydi. `prefers-reduced-motion` yoqilgan
 * bo'lsa CSS animatsiyani o'chiradi va kontent darhol ko'rinadi.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  id,
}: {
  children: React.ReactNode;
  /** millisekundlarda kechikish */
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "ol";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Element allaqachon ko'rinib turgan bo'lsa kuzatuvsiz ochamiz.
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref as React.Ref<never>}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`yw-reveal ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Raqamni 0 dan berilgan qiymatgacha sanaydi.
 * Statistika bloklarida ishlatiladi.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1100,
  className = "",
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Harakat kamaytirilgan bo'lsa animatsiya yo'q — display allaqachon
    // yakuniy qiymatga teng, shuning uchun holatni o'zgartirmaymiz.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || value === 0) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        obs.disconnect();

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
