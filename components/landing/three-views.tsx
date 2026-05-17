"use client";

import { Lock, BarChart2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const views = [
  {
    role: "Inversionista",
    icon: Lock,
    iconColor: "text-encrypted",
    iconBg: "bg-encrypted/10",
    accent: "border-t-encrypted",
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
    iconBg: "bg-accent/10",
    accent: "border-t-accent",
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
    iconBg: "bg-danger/10",
    accent: "border-t-danger",
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
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium tracking-widest text-foreground-subtle uppercase mb-3"
        >
          Una blockchain, tres vistas
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-12 max-w-lg"
        >
          La misma información. El acceso correcto para cada rol.
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-64px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {views.map(({ role, icon: Icon, iconColor, iconBg, accent, rows, caption }) => (
            <motion.div
              key={role}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
              whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(26, 54, 93, 0.10)" }}
              transition={{ duration: 0.2 }}
              className={`rounded-lg border border-border bg-surface-elevated overflow-hidden border-t-2 ${accent} cursor-default`}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-surface">
                <span className="h-2 w-2 rounded-full bg-border-strong" />
                <span className="h-2 w-2 rounded-full bg-border-strong" />
                <span className="h-2 w-2 rounded-full bg-border-strong" />
                <span className="ml-2 text-[10px] font-mono text-foreground-subtle">arkchain.io/app</span>
              </div>
              <div className="p-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} mb-3`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <p className="font-medium text-sm text-foreground mb-3">{role}</p>
                <div className="space-y-2">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className={`flex justify-between items-center text-xs rounded px-2 py-1 ${
                        row.auditor ? "bg-danger/5 border-l-2 border-danger" : "bg-surface"
                      }`}
                    >
                      <span className="text-foreground-muted">{row.label}</span>
                      <span className={`font-mono ${row.blur ? "text-encrypted" : "text-foreground"}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-foreground-subtle">{caption}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
