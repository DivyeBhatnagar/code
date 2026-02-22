'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Loader2, Copy, Check } from 'lucide-react';
import { DemoModeResponse } from '@/lib/api';
import { useState } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoData: DemoModeResponse | null;
  isLoading: boolean;
}

export default function DemoModal({ isOpen, onClose, demoData, isLoading }: DemoModalProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sections = demoData ? [
    { key: 'problem_explained', label: 'Problem Explained', content: demoData.problem_explained },
    { key: 'solution_explained', label: 'Solution Explained', content: demoData.solution_explained },
    { key: 'component_breakdown', label: 'Component Breakdown', content: demoData.component_breakdown },
    { key: 'how_to_demo', label: 'How to Demo', content: demoData.how_to_demo },
    { key: 'judge_impression_tips', label: 'Judge Impression Tips', content: demoData.judge_impression_tips },
    { key: '2_min_script', label: '2-Minute Demo Script', content: demoData["2_min_script"] },
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Demo Mode</h2>
                    <p className="text-sm text-gray-600">AI-generated demo guide for your project</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                    <p className="text-gray-600">Generating your demo guide...</p>
                  </div>
                ) : demoData ? (
                  <div className="space-y-6">
                    {sections.map(({ key, label, content }) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                          <button
                            onClick={() => copyToClipboard(content, key)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedSection === key ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No demo data available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
