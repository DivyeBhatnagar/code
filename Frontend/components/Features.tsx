"use client";

import { motion } from "framer-motion";
import { Brain, Layers, Shield, Rocket, Sparkles, Map } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Scoping",
    description: "Instantly identify what's essential for your MVP and what can wait for V2. No more over-scoping at 3 AM.",
  },
  {
    icon: Layers,
    title: "Team Command",
    description: "Synchronize roles seamlessly. Everyone knows exactly what to build to get the demo ready for judging.",
  },
  {
    icon: Shield,
    title: "Risk Shield",
    description: "Real-time feasibility monitoring warns you when you're drifting off course or missing critical deadlines.",
  },
  {
    icon: Sparkles,
    title: "AI Code Assistant",
    description: "Get intelligent code suggestions, explanations, and refactoring recommendations in real-time.",
  },
  {
    icon: Rocket,
    title: "Tech Stack Advisor",
    description: "Get intelligent recommendations on the best technologies for your hackathon project based on your goals.",
  },
  {
    icon: Map,
    title: "Execution Roadmap",
    description: "Automated timeline generation with milestones, dependencies, and realistic deadlines for your team.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Powerful features designed to help you ship faster and win bigger
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all"
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all" />
              
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
