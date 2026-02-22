'use client';

import { motion } from 'framer-motion';
import { Video, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ScriptSection {
  title: string;
  duration: string;
  content: string;
}

interface DemoScriptCardProps {
  sections: ScriptSection[];
}

export default function DemoScriptCard({ sections }: DemoScriptCardProps) {
  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    const fullScript = sections.map(s => `${s.title} (${s.duration}):\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-xl">
            <Video className="w-5 h-5 text-pink-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Two-Minute Demo Script</h2>
        </div>
        <button
          onClick={copyScript}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Script
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-pink-50 to-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                {section.duration}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
