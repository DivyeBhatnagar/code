'use client';

import { Download, RefreshCw, Sparkles, Brain, MessageSquare, Eye, EyeOff } from 'lucide-react';

interface ProjectToolbarProps {
  projectName: string;
  projectData: any;
  onDownload: () => void;
  onRegenerate: () => void;
  onExplain: () => void;
  onRefactor: () => void;
  onChat: () => void;
  isLoading?: boolean;
  showPreview?: boolean;
  onTogglePreview?: () => void;
}

export default function ProjectToolbar({ 
  projectName,
  projectData,
  onDownload, 
  onRegenerate,
  onExplain,
  onRefactor,
  onChat,
  isLoading = false,
  showPreview = true,
  onTogglePreview
}: ProjectToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#0F0F0F] border-b border-[#1F1F1F]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2563EB]/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{projectName}</h2>
            <p className="text-xs text-[#9CA3AF]">AI Generated Project</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onTogglePreview && (
          <>
            <button
              onClick={onTogglePreview}
              className="px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200 flex items-center gap-2"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <div className="w-px h-6 bg-[#1F1F1F]" />
          </>
        )}

        <button
          onClick={onExplain}
          disabled={isLoading}
          className="px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          title="Explain current file"
        >
          <Brain className="w-4 h-4" />
          Explain
        </button>
        
        <button
          onClick={onRefactor}
          disabled={isLoading}
          className="px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          title="Refactor current file"
        >
          <RefreshCw className="w-4 h-4" />
          Refactor
        </button>

        <button
          onClick={onChat}
          disabled={isLoading}
          className="px-3 py-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          title="Chat with AI"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>

        <div className="w-px h-6 bg-[#1F1F1F]" />

        <button
          onClick={onDownload}
          disabled={isLoading}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
        >
          <Download className="w-4 h-4" />
          Download ZIP
        </button>
      </div>
    </div>
  );
}
