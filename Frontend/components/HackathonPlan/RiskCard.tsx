'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';

interface Risk {
  description: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

interface RiskCardProps {
  risks: Risk[];
}

export default function RiskCard({ risks }: RiskCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-50 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Risk Analysis</h2>
      </div>

      <div className="space-y-4">
        {risks.map((risk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gray-50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{risk.description}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                    {risk.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(risk.severity)}`}>
                    {risk.severity} Severity
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Mitigation Strategy</p>
                  <p className="text-sm text-gray-700">{risk.mitigation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
