"use client";

import { motion } from "framer-motion";

const techs = ["Avalanche L1", "eERC20", "ICM (Interchain Messaging)", "Wavy Node Compliance"];

export function TechCredibility() {
  return (
    <section className="py-12 px-6 border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.4 } },
            }}
            className="text-xs font-medium text-foreground-subtle tracking-widest uppercase"
          >
            Construido sobre
          </motion.p>
          {techs.map((t) => (
            <motion.div
              key={t}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ scale: 1.04, opacity: 1 }}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground-muted opacity-60 hover:opacity-100 hover:border-primary/30 transition-all cursor-default"
            >
              {t}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
