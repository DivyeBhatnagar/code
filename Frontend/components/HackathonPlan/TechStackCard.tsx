'use client';

import { motion } from 'framer-motion';
import { Layers, Code, Database, Cloud, Wrench } from 'lucide-react';

interface TechStackCardProps {
  frontend: string[];
  backend: string[];
  deployment: string[];
  tools: string[];
}

export default function TechStackCard({ frontend, backend, deployment, tools }: TechStackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <Layers className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Tech Stack</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Frontend</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {frontend.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold text-gray-900">Backend</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {backend.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Deployment */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Cloud className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Deployment</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {deployment.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white text-purple-700 rounded-lg text-sm font-medium border border-purple-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Development Tools</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tools.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white text-orange-700 rounded-lg text-sm font-medium border border-orange-200 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
