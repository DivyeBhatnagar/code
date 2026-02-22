'use client';

import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TimelineBlock {
  hours: string;
  title: string;
  tasks: string[];
}

interface TimelineCardProps {
  timeline: TimelineBlock[];
}

export default function TimelineCard({ timeline }: TimelineCardProps) {
  const [activeBlock, setActiveBlock] = useState<number>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Timeline Overview</h2>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {timeline.map((block, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => setActiveBlock(index)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeBlock === index
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {block.title}
            </button>
            {index < timeline.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Timeline Details */}
      <div className="space-y-4">
        {timeline.map((block, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-xl p-4 transition-all ${
              activeBlock === index
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{block.title}</h3>
              <span className="text-sm font-medium text-blue-600 bg-white px-3 py-1 rounded-full">
                {block.hours}
              </span>
            </div>
            <ul className="space-y-2">
              {block.tasks.map((task, taskIndex) => (
                <li key={taskIndex} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
