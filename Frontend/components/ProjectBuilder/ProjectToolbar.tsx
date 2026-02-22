'use client';

import { Download, RefreshCw, Sparkles, Brain, MessageSquare, Presentation } from 'lucide-react';

interface ProjectToolbarProps {
  projectName: string;
  projectData: any;
  onDownload: () => void;
  onRegenerate: () => void;
  onExplain: () => void;
  onRefactor: () => void;
  onChat: () => void;
  onPitch: () => void;
  isLoading?: boolean;
}

export default function ProjectToolbar({ 
  projectName,
  projectData,
  onDownload, 
  onRegenerate,
  onExplain,
  onRefactor,
  onChat,
  onPitch,
  isLoading = false 
}: ProjectToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{projectName}</h2>
            <p className="text-xs text-gray-500">AI Generated Project</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExplain}
          disabled={isLoading}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Explain current file"
        >
          <Brain className="w-4 h-4" />
          Explain
        </button>
        
        <button
          onClick={onRefactor}
          disabled={isLoading}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Refactor current file"
        >
          <RefreshCw className="w-4 h-4" />
          Refactor
        </button>

        <button
          onClick={onChat}
          disabled={isLoading}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Chat with AI"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>

        <button
          onClick={onPitch}
          disabled={isLoading}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Generate pitch"
        >
          <Presentation className="w-4 h-4" />
          Pitch
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={onDownload}
          disabled={isLoading}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Download ZIP
        </button>
      </div>
    </div>
  );
}
