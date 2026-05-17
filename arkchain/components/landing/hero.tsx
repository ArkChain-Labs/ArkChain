"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center pt-24 pb-16 px-6 max-w-5xl mx-auto">
      {/* Faded logo mark as background texture */}
      <div className="absolute top-10 right-0 h-[42vmin] w-[42vmin] pointer-events-none select-none" aria-hidden>
        <img
          src="/logo.png"
          alt=""
          className="w-full h-full object-contain opacity-[0.05]"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase mb-7 font-medium"
      >
        Infraestructura institucional · LATAM
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-semibold text-foreground leading-[1.03] tracking-tight mb-5 max-w-3xl"
      >
        Liquidez{" "}
        <em className="not-italic italic">privada</em>
        {" "}para el equity privado de LATAM.
      </motion.h1>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.45, delay: 0.22 }}
        style={{ transformOrigin: "left" }}
        className="h-px w-20 bg-accent mb-6"
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="text-[15px] text-foreground-muted max-w-lg mb-9 leading-[1.7]"
      >
        El primer mercado secundario regulado, confidencial y auditable para
        plataformas de equity crowdfunding en México, Brasil, Argentina, Colombia,
        Chile y Perú. Construido sobre Avalanche.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-primary-hover transition-colors"
        >
          Solicitar piloto
        </Link>
        <Link
          href="#como-funciona"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
        >
          Ver demo
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.38 }}
        className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-foreground-subtle"
      >
        {["CNBV", "CVM", "CNV", "SFC", "CMF", "SMV"].map((reg) => (
          <span key={reg} className="flex items-center gap-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-success inline-block" />
            Compatible con {reg}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
