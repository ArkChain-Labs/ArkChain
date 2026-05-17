"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Geometric arc decorations — echoes logo's arc geometry */}
      <div className="absolute -top-48 -right-48 h-[640px] w-[640px] rounded-full border border-primary/5 pointer-events-none select-none" />
      <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full border border-primary/5 pointer-events-none select-none" />
      <div className="absolute top-8 -right-8 h-[200px] w-[200px] rounded-full border border-primary/5 pointer-events-none select-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary tracking-widest mb-8 uppercase"
      >
        Infraestructura institucional · LATAM
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.05] tracking-tight mb-6 max-w-3xl"
      >
        Liquidez{" "}
        <em className="not-italic italic text-primary">privada</em> para el
        equity privado de LATAM.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="text-lg text-foreground-muted max-w-2xl mb-10 leading-relaxed"
      >
        ArkChain es el primer mercado secundario regulado, confidencial y
        auditable para plataformas de equity crowdfunding en México, Brasil,
        Argentina, Colombia, Chile y Perú. Construido sobre Avalanche.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors shadow-sm"
        >
          Solicitar piloto
        </Link>
        <Link
          href="#como-funciona"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:border-border-strong transition-colors"
        >
          Ver demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-subtle"
      >
        {["CNBV", "CVM", "CNV", "SFC", "CMF", "SMV"].map((reg) => (
          <span key={reg} className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-success inline-block" />
            Compatible con {reg}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
