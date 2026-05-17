"use client";

import { motion } from "framer-motion";

const techs = ["Avalanche L1", "eERC20", "ICM (Interchain Messaging)", "Wavy Node Compliance"];

export function TechCredibility() {
  return (
    <section className="py-10 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}
            className="text-[11px] tracking-[0.15em] text-foreground-subtle uppercase"
          >
            Construido sobre
          </motion.p>
          {techs.map((t) => (
            <motion.div
              key={t}
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
              whileHover={{ scale: 1.03 }}
              className="rounded border border-border px-3.5 py-1.5 text-xs font-medium text-foreground-muted opacity-50 hover:opacity-100 hover:border-border-strong hover:text-foreground transition-all cursor-default"
            >
              {t}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
