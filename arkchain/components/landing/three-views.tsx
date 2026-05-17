"use client";

import { Lock, BarChart2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const views = [
  {
    role: "Inversionista",
    icon: Lock,
    iconColor: "text-encrypted",
    topBorder: "border-t-encrypted",
    rows: [
      { label: "FintechMX", value: "••••  MXN", blur: true, auditor: false },
      { label: "LogiPay", value: "••••  MXN", blur: true, auditor: false },
      { label: "AgroTech", value: "••••  MXN", blur: true, auditor: false },
    ],
    caption: "Datos cifrados · Solo tú ves tus posiciones",
  },
  {
    role: "Emisor",
    icon: BarChart2,
    iconColor: "text-accent",
    topBorder: "border-t-accent",
    rows: [
      { label: "Fundadores", value: "35%", blur: false, auditor: false },
      { label: "VC Institucional", value: "20%", blur: false, auditor: false },
      { label: "Retail (Arkangeles)", value: "18%", blur: false, auditor: false },
    ],
    caption: "Cap table parcial · Solo el emisor ve nombres",
  },
  {
    role: "Regulador (CNBV)",
    icon: ShieldCheck,
    iconColor: "text-danger",
    topBorder: "border-t-danger",
    rows: [
      { label: "María Pérez García", value: "$294,000 MXN", blur: false, auditor: true },
      { label: "Juan López Martínez", value: "$205,000 MXN", blur: false, auditor: true },
      { label: "Ana González Ruiz", value: "$142,400 MXN", blur: false, auditor: true },
    ],
    caption: "Vista descifrada · Auditor mode activo",
  },
];

export function ThreeViews() {
  return (
    <section className="py-20 px-6 border-t border-border bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.18em] text-foreground-subtle uppercase mb-3"
        >
          Una blockchain, tres vistas
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-12 max-w-lg leading-tight"
        >
          La misma información. El acceso correcto para cada rol.
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {views.map(({ role, icon: Icon, iconColor, topBorder, rows, caption }) => (
            <motion.div
              key={role}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18 }}
              className={`rounded-lg border border-border bg-background overflow-hidden border-t-2 ${topBorder}`}
            >
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-surface">
                <span className="h-[7px] w-[7px] rounded-full bg-border-strong" />
                <span className="h-[7px] w-[7px] rounded-full bg-border-strong" />
                <span className="h-[7px] w-[7px] rounded-full bg-border-strong" />
                <span className="ml-2 text-[10px] font-mono text-foreground-subtle">arkchain.io/app</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  <p className="text-xs font-medium text-foreground">{role}</p>
                </div>
                <div className="space-y-1.5">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className={`flex justify-between items-center text-xs rounded px-2 py-1.5 ${
                        row.auditor ? "bg-danger/5 border-l-2 border-danger" : "bg-surface"
                      }`}
                    >
                      <span className="text-foreground-muted">{row.label}</span>
                      <span className={`font-mono text-[11px] ${row.blur ? "text-encrypted" : "text-foreground"}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-foreground-subtle leading-relaxed">{caption}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
