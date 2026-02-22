'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { ProjectScoreResponse } from '@/lib/api';

interface HealthReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scoreData: ProjectScoreResponse | null;
}

export default function HealthReportPanel({ isOpen, onClose, scoreData }: HealthReportPanelProps) {
  if (!scoreData) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categories = [
    { 
      key: 'tests', 
      label: 'Tests', 
      max: 15,
      tips: [
        'Add unit tests for core functions',
        'Include integration tests for API endpoints',
        'Aim for at least 70% code coverage',
        'Use testing frameworks like Jest, Pytest, or JUnit'
      ]
    },
    { 
      key: 'docker', 
      label: 'Docker', 
      max: 10,
      tips: [
        'Create a Dockerfile for containerization',
        'Add docker-compose.yml for multi-service setup',
        'Use multi-stage builds to reduce image size',
        'Include .dockerignore to exclude unnecessary files'
      ]
    },
    { 
      key: 'error_handling', 
      label: 'Error Handling', 
      max: 12,
      tips: [
        'Wrap critical code in try-catch blocks',
        'Return meaningful error messages',
        'Log errors with proper context',
        'Handle edge cases and validation errors'
      ]
    },
    { 
      key: 'readme', 
      label: 'README', 
      max: 10,
      tips: [
        'Add clear project description and purpose',
        'Include installation and setup instructions',
        'Document API endpoints and usage examples',
        'Add screenshots or demo links'
      ]
    },
    { 
      key: 'security', 
      label: 'Security', 
      max: 20,
      tips: [
        'Never commit API keys or secrets',
        'Use environment variables for sensitive data',
        'Implement authentication and authorization',
        'Validate and sanitize all user inputs',
        'Keep dependencies updated'
      ]
    },
    { 
      key: 'structure', 
      label: 'Structure', 
      max: 15,
      tips: [
        'Organize code into logical folders',
        'Separate concerns (routes, services, models)',
        'Follow consistent naming conventions',
        'Keep files focused and modular'
      ]
    },
    { 
      key: 'logging', 
      label: 'Logging', 
      max: 10,
      tips: [
        'Add logging for important operations',
        'Use different log levels (info, warn, error)',
        'Include timestamps and context in logs',
        'Use a logging library for better control'
      ]
    },
    { 
      key: 'env_vars', 
      label: 'Environment Variables', 
      max: 8,
      tips: [
        'Create .env.example file with all required variables',
        'Add .env to .gitignore',
        'Document each environment variable',
        'Use validation for required env vars'
      ]
    },
  ];

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
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Health Report</h2>
                    <p className="text-sm text-gray-600">Detailed analysis of your project</p>
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
              <div className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="text-center py-8 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl">
                  <div className={`text-6xl font-bold ${getScoreColor(scoreData.score)}`}>
                    {scoreData.score}
                  </div>
                  <div className="text-gray-600 mt-2">Overall Health Score</div>
                </div>

                {/* Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    {categories.map(({ key, label, max, tips }) => {
                      const value = scoreData.breakdown[key as keyof typeof scoreData.breakdown];
                      const percentage = (value / max) * 100;
                      const needsImprovement = percentage < 80;
                      
                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">{label}</span>
                            <span className="text-gray-600">{value}/{max}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <div
                              className={`h-full transition-all ${
                                percentage >= 80 ? 'bg-green-500' :
                                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          {needsImprovement && (
                            <div className="mt-2 pl-3 border-l-2 border-blue-400">
                              <p className="text-xs font-semibold text-gray-700 mb-1">How to improve:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {tips.map((tip, idx) => (
                                  <li key={idx}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Improvements</h3>
                  <div className="space-y-2">
                    {scoreData.improvements.map((improvement, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
