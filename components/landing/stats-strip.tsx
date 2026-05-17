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
    <section className="py-16 px-6 border-t border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-64px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="text-center md:text-left"
            >
              <p className="font-mono text-4xl font-bold text-primary tabular mb-1">
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
