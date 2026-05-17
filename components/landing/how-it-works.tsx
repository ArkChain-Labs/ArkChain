"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Emisión", body: "La startup tokeniza su equity como eERC20 sobre Avalanche. Los tokens nacen cifrados: solo el emisor y el auditor habilitado pueden ver saldos completos." },
  { num: "02", title: "Distribución privada", body: "Arkangeles (o cualquier plataforma integrada) distribuye los tokens a inversionistas verificados. KYC automático vía Wavy Node en menos de 30 segundos." },
  { num: "03", title: "Trade peer-to-peer", body: "Los inversionistas publican órdenes de venta en el marketplace. Wavy Node verifica la contraparte antes de ejecutar. El trade sucede on-chain en < 2 segundos." },
  { num: "04", title: "Reporte al regulador", body: "El regulador (CNBV, CVM, SFC…) accede con su llave de auditor y ve el ledger descifrado. Descarga el reporte en formato CNBV-1437 con un clic." },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium tracking-widest text-foreground-subtle uppercase mb-3"
        >
          Cómo funciona
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-14 max-w-lg"
        >
          Cuatro pasos. Una infraestructura.
        </motion.h2>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-5 left-8 right-8 h-px bg-border hidden md:block" />

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-64px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13 } },
            }}
          >
            {steps.map(({ num, title, body }) => (
              <motion.div
                key={num}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
                }}
                className="relative"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/40 bg-surface mb-4 shadow-sm">
                  <span className="font-display text-sm font-semibold text-accent">{num}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
