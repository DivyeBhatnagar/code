'use client';

import { motion } from 'framer-motion';
import { FolderTree } from 'lucide-react';

interface FolderStructureCardProps {
  structure: string;
}

export default function FolderStructureCard({ structure }: FolderStructureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-xl">
          <FolderTree className="w-5 h-5 text-gray-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Suggested Project Structure</h2>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono whitespace-pre">
          {structure}
        </pre>
      </div>
    </motion.div>
  );
}
