'use client';

import { motion } from 'framer-motion';
import { Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SetupStep {
  title: string;
  description: string;
}

interface KickstartGuideCardProps {
  backendSteps: SetupStep[];
  frontendSteps: SetupStep[];
}

export default function KickstartGuideCard({ backendSteps, frontendSteps }: KickstartGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Rocket className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Technical Kickstart Guide</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
        >
          {/* Backend Steps */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-white">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full" />
              Backend Setup
            </h3>
            <div className="space-y-4">
              {backendSteps.map((step, index) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute left-0 top-1 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frontend Steps */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
              Frontend Setup
            </h3>
            <div className="space-y-4">
              {frontendSteps.map((step, index) => (
                <div key={index} className="relative pl-6">
                  <div className="absolute left-0 top-1 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
