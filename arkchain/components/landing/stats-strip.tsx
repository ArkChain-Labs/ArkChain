"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "USD 23B", label: "Mercado privado ilíquido LATAM" },
  { value: "6", label: "Jurisdicciones soportadas" },
  { value: "< 2s", label: "Finality en Avalanche L1" },
  { value: "100%", label: "Auditable end-to-end" },
];

export function StatsStrip() {
  return (
    <section className="border-t border-border px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="px-8 first:pl-0 last:pr-0"
            >
              <p className="font-mono text-[2.4rem] font-bold text-foreground tabular leading-none mb-1.5">
                {value}
              </p>
              <p className="text-xs text-foreground-subtle leading-snug">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
