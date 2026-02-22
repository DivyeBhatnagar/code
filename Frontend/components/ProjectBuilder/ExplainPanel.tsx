'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, GitBranch, Package, TrendingUp } from 'lucide-react';
import { ExplainCodeResponse } from '@/lib/api';
import { useEffect } from 'react';

interface ExplainPanelProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: ExplainCodeResponse | null;
  isLoading: boolean;
}

export default function ExplainPanel({ isOpen, onClose, explanation, isLoading }: ExplainPanelProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-30 cursor-pointer"
            title="Click to close"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-40 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Code Explanation</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close panel"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : explanation ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold text-gray-900">Purpose</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{explanation.purpose}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GitBranch className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold text-gray-900">Execution Flow</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{explanation.flow}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold text-gray-900">Key Components</h4>
                    </div>
                    <ul className="space-y-2">
                      {explanation.key_components.map((component, index) => (
                        <li key={index} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-accent">•</span>
                          <span>{component}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold text-gray-900">Improvements</h4>
                    </div>
                    <ul className="space-y-2">
                      {explanation.improvements.map((improvement, index) => (
                        <li key={index} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-green-600">✓</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Select a file and click &quot;Explain&quot; to see details</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
