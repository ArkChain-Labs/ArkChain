"use client";

import { motion } from "framer-motion";
import { LatamMap } from "@/components/shared/latam-map";

export function ExpansionMap() {
  return (
    <section className="py-20 px-6 border-t border-border bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase mb-3">
              Expansión regional
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
              Una infraestructura, seis jurisdicciones.
            </h2>
            <p className="text-[15px] text-foreground-muted mb-8 leading-[1.7]">
              ArkChain conecta plataformas reguladas de toda LATAM en un único
              ledger on-chain. Cada jurisdicción opera con su propio regulador y
              stablecoin local, pero comparte la misma infraestructura de
              compliance y liquidez.
            </p>
            <motion.div
              className="space-y-1.5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            >
              {[
                { country: "México", reg: "CNBV", platform: "Arkangeles", coin: "MXNB" },
                { country: "Brasil", reg: "CVM", platform: "BEE4", coin: "BRZ" },
                { country: "Colombia", reg: "SFC", platform: "a2censo", coin: "COPW" },
              ].map(({ country, reg, platform, coin }) => (
                <motion.div
                  key={country}
                  variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.38 } } }}
                  className="flex items-center justify-between text-sm border border-border rounded-lg px-3.5 py-2.5 bg-background hover:border-border-strong transition-colors"
                >
                  <span className="font-medium text-foreground">{country}</span>
                  <span className="text-foreground-subtle text-xs">{reg}</span>
                  <span className="text-foreground-subtle text-xs">{platform}</span>
                  <span className="font-mono text-accent text-xs font-semibold">{coin}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55 }}
          >
            <LatamMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
