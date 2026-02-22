'use client';

import { motion } from 'framer-motion';
import { Code, Zap } from 'lucide-react';

interface ActionButtonsBarProps {
  onStartBuilding: () => void;
  onOptimizePlan: () => void;
  isOptimizing?: boolean;
  isBuilding?: boolean;
}

export default function ActionButtonsBar({ 
  onStartBuilding, 
  onOptimizePlan,
  isOptimizing = false,
  isBuilding = false
}: ActionButtonsBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-6 mb-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Execute?</h3>
          <p className="text-sm text-gray-600">Start building your project with AI or optimize the plan</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onStartBuilding}
            disabled={isBuilding}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Code className="w-5 h-5" />
            {isBuilding ? 'Building Project...' : 'Start Building'}
          </button>
          
          <button
            onClick={onOptimizePlan}
            disabled={isOptimizing}
            className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Plan'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
