"use client";

import { motion } from "framer-motion";
import { LatamMap } from "@/components/shared/latam-map";

export function ExpansionMap() {
  return (
    <section className="py-20 px-6 bg-surface border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-64px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-xs font-medium tracking-widest text-foreground-subtle uppercase mb-3">
              Expansión regional
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Una infraestructura, seis jurisdicciones.
            </h2>
            <p className="text-foreground-muted mb-8 leading-relaxed">
              ArkChain conecta plataformas reguladas de toda LATAM en un único
              ledger on-chain. Cada jurisdicción opera con su propio regulador y
              stablecoin local, pero comparte la misma infraestructura de
              compliance y liquidez.
            </p>
            <motion.div
              className="space-y-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              }}
            >
              {[
                { country: "México", reg: "CNBV", platform: "Arkangeles", coin: "MXNB" },
                { country: "Brasil", reg: "CVM", platform: "BEE4", coin: "BRZ" },
                { country: "Colombia", reg: "SFC", platform: "a2censo", coin: "COPW" },
              ].map(({ country, reg, platform, coin }) => (
                <motion.div
                  key={country}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                  className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2 bg-background hover:bg-surface-elevated hover:border-border-strong transition-colors"
                >
                  <span className="font-medium text-foreground">{country}</span>
                  <span className="text-foreground-subtle">{reg}</span>
                  <span className="text-foreground-subtle">{platform}</span>
                  <span className="font-mono text-accent text-xs font-semibold">{coin}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-64px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <LatamMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
