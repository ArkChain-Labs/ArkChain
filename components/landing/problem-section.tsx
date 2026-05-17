"use client";

import { Lock, TrendingDown, FileX } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: TrendingDown,
    title: "Iliquidez estructural",
    body: "El capital de los inversionistas queda atrapado 5 a 10 años sin mecanismos de salida. No hay mercado secundario formal en ninguna jurisdicción LATAM.",
  },
  {
    icon: Lock,
    title: "Cap tables públicos",
    body: "Los registros on-chain actuales exponen información sensible de tenedores. Privacidad inaceptable para fondos institucionales y family offices.",
  },
  {
    icon: FileX,
    title: "Compliance manual",
    body: "Las verificaciones KYC/AML se hacen off-chain, con fricción enorme y sin trazabilidad auditable. Cada trade toma días y cuesta márgenes enteros.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium tracking-widest text-foreground-subtle uppercase mb-12"
        >
          El problema
        </motion.p>
        <motion.div
          className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-64px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {problems.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
              whileHover={{ backgroundColor: "hsl(0, 0%, 100%)" }}
              transition={{ duration: 0.2 }}
              className="py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0 rounded-lg"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 mb-5">
                <Icon className="h-4.5 w-4.5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {title}
              </h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
