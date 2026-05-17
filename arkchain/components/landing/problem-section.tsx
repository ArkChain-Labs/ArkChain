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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase mb-14"
        >
          El problema
        </motion.p>

        <div className="divide-y divide-border">
          {problems.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex gap-8 py-9 group"
            >
              <span className="font-mono text-xs text-foreground-subtle pt-0.5 shrink-0 w-6">
                0{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Icon className="h-4 w-4 text-foreground-subtle shrink-0 group-hover:text-foreground transition-colors duration-200" />
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-foreground-muted leading-[1.7] max-w-2xl">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
