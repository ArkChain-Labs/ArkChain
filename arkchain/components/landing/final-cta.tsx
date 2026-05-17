"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="py-24 px-6 bg-foreground relative overflow-hidden">
      {/* Faded logo mark (inverted for dark bg) */}
      <div className="absolute -bottom-8 -right-8 h-72 w-72 pointer-events-none select-none opacity-[0.04]" aria-hidden>
        <img
          src="/logo.png"
          alt=""
          className="w-full h-full object-contain"
          style={{ filter: "invert(1)" }}
        />
      </div>

      <motion.div
        className="max-w-2xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold text-background leading-tight mb-4">
          Construido para reguladores.
          <br />
          Diseñado para escalar.
        </h2>
        <p className="text-background/55 mb-9 leading-relaxed text-[15px] max-w-lg mx-auto">
          ArkChain conecta las plataformas de equity crowdfunding más importantes de
          LATAM en una infraestructura on-chain privada, auditable y lista para
          cumplimiento regulatorio.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-surface transition-colors"
        >
          Hablar con el equipo
        </Link>
      </motion.div>
    </section>
  );
}
