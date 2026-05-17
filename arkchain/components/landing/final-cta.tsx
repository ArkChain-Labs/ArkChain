"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCta() {
  return (
    <section className="py-24 px-6 bg-primary relative overflow-hidden">
      {/* Geometric arc decorations — echoes logo geometry */}
      <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full border border-primary-foreground/5 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-[280px] w-[280px] rounded-full border border-primary-foreground/5 pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full border border-primary-foreground/5 pointer-events-none" />

      <motion.div
        className="max-w-2xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">
          Construido para reguladores.
          <br />
          Diseñado para escalar.
        </h2>
        <p className="text-primary-foreground/70 mb-8 leading-relaxed">
          ArkChain conecta las plataformas de equity crowdfunding más importantes de
          LATAM en una infraestructura on-chain privada, auditable y lista para
          cumplimiento regulatorio.
        </p>
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.15 }}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors shadow-lg"
          >
            Hablar con el equipo
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
