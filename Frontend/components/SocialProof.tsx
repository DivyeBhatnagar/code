"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function SocialProof() {
  return (
    <section className="py-12 px-6 lg:px-8 border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="text-2xl font-bold">1,000+</div>
              <div className="text-sm text-gray-500">Active Hackers</div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200" />

          <div className="text-left">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-gray-500">Winning Projects</div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200" />

          <div className="text-left">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm text-gray-500">Hackathons</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
