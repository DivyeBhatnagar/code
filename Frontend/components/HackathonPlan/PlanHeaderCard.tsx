'use client';

import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';

interface PlanHeaderCardProps {
  projectName: string;
  generatedDate: string;
}

export default function PlanHeaderCard({ projectName, generatedDate }: PlanHeaderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{projectName}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4" />
            <span>Generated on {new Date(generatedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
