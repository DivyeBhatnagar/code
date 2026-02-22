'use client';

import { motion } from 'framer-motion';
import { Target, CheckCircle, Circle, Sparkles } from 'lucide-react';

interface MVPScopeCardProps {
  coreFeatures: string[];
  optionalFeatures: string[];
  stretchGoals: string[];
}

export default function MVPScopeCard({ coreFeatures, optionalFeatures, stretchGoals }: MVPScopeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-xl">
          <Target className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">MVP Scope</h2>
      </div>

      <div className="space-y-6">
        {/* Core Features */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Core Features (Must-Have)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {coreFeatures.map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Optional Features */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Circle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Optional Features (If Time Permits)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {optionalFeatures.map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Stretch Goals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Stretch Goals (Ambitious)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stretchGoals.map((feature, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
