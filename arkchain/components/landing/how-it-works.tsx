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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase mb-3"
        >
          Cómo funciona
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-14 max-w-md leading-tight"
        >
          Cuatro pasos. Una infraestructura.
        </motion.h2>

        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-px bg-border hidden md:block" />

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
          >
            {steps.map(({ num, title, body }) => (
              <motion.div
                key={num}
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.48 } } }}
                className="relative"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground mb-5">
                  <span className="font-mono text-xs font-semibold text-background">{num}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground-muted leading-[1.7]">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
