"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Gradient glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
          
          {/* Main card */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl overflow-hidden">
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 opacity-50 blur-xl animate-gradient" />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white"
              >
                Start Winning Hackathons Today
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-blue-50 mb-10 leading-relaxed"
              >
                Code smarter. Build faster. Ship confidently.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="px-10 py-4 bg-white text-blue-600 font-semibold rounded-full hover:shadow-2xl transition-all"
              >
                Launch CodePilot AI
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
