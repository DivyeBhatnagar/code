'use client';

import { useState, useEffect } from 'react';
import FileTree from './FileTree';
import MonacoEditor from './MonacoEditor';
import ProjectToolbar from './ProjectToolbar';
import ProjectTabs from './ProjectTabs';
import ExplainPanel from './ExplainPanel';
import ChatSidebar from './ChatSidebar';
import RefactorResultModal from './RefactorResultModal';
import { explainCode, refactorCode, ExplainCodeResponse } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface ProjectData {
  project_name: string;
  description: string;
  files: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
  dependencies: string[];
  run_commands: string[];
  setup_instructions: string[];
}

interface CodeEditorLayoutProps {
  projectData: ProjectData;
  onDownload: () => void;
  onRegenerate: () => void;
  onPitch: () => void;
  isLoading?: boolean;
}

export default function CodeEditorLayout({ 
  projectData, 
  onDownload, 
  onRegenerate,
  onPitch,
  isLoading = false 
}: CodeEditorLayoutProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState('');
  const [currentFileLanguage, setCurrentFileLanguage] = useState('plaintext');
  
  // Panel states
  const [explainPanelOpen, setExplainPanelOpen] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [refactorModalOpen, setRefactorModalOpen] = useState(false);
  
  // Data states
  const [explanation, setExplanation] = useState<ExplainCodeResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [refactorResult, setRefactorResult] = useState<{ explanation: string; fileName: string } | null>(null);

  // Auto-select first file on load
  useEffect(() => {
    if (projectData.files.length > 0 && !activeFile) {
      const firstFile = projectData.files[0];
      setActiveFile(firstFile.path);
      setCurrentFileContent(firstFile.content);
      setCurrentFileLanguage(getLanguageFromPath(firstFile.path, firstFile.language));
    }
  }, [projectData.files, activeFile]);

  const handleFileSelect = (path: string) => {
    const file = projectData.files.find(f => f.path === path);
    if (file) {
      setActiveFile(path);
      setCurrentFileContent(file.content);
      setCurrentFileLanguage(getLanguageFromPath(file.path, file.language));
    }
  };

  const handleExplain = async () => {
    if (!activeFile) return;
    
    setIsExplaining(true);
    setExplainPanelOpen(true);
    
    try {
      const result = await explainCode({
        file_path: activeFile,
        content: currentFileContent
      });
      setExplanation(result);
    } catch (error) {
      console.error('Explain failed:', error);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleRefactor = async () => {
    if (!activeFile) return;
    
    setIsRefactoring(true);
    
    try {
      const result = await refactorCode({
        scope: 'file',
        file_path: activeFile,
        content: currentFileContent,
        project_context: projectData
      });
      
      if (result.updated_files.length > 0) {
        const updatedFile = result.updated_files[0];
        setCurrentFileContent(updatedFile.content);
        
        // Update in projectData
        const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
        if (fileIndex !== -1) {
          projectData.files[fileIndex].content = updatedFile.content;
        }
        
        // Show refactor result modal
        setRefactorResult({
          explanation: result.explanation,
          fileName: activeFile
        });
        setRefactorModalOpen(true);
      }
    } catch (error: any) {
      alert(`Refactor failed: ${error.message}`);
    } finally {
      setIsRefactoring(false);
    }
  };

  const getLanguageFromPath = (path: string, language?: string): string => {
    if (language) return language;

    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'json': 'json',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'sh': 'shell',
      'bash': 'shell',
      'sql': 'sql',
      'go': 'go',
      'rs': 'rust',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
    };

    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <ProjectToolbar
        projectName={projectData.project_name}
        projectData={projectData}
        onDownload={onDownload}
        onRegenerate={onRegenerate}
        onExplain={handleExplain}
        onRefactor={handleRefactor}
        onChat={() => setChatSidebarOpen(true)}
        onPitch={onPitch}
        isLoading={isLoading || isRefactoring}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Tree */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Project Files</h3>
          </div>
          <FileTree
            files={projectData.files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <>
              <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono border-b border-gray-700 flex items-center justify-between">
                <span>{activeFile}</span>
                {isRefactoring && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Refactoring...
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  content={currentFileContent}
                  language={currentFileLanguage}
                  readOnly={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No file selected</p>
                <p className="text-sm">Select a file from the tree to view its content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tabs */}
      <ProjectTabs
        dependencies={projectData.dependencies}
        setupInstructions={projectData.setup_instructions}
        runCommands={projectData.run_commands}
      />

      {/* Side Panels */}
      <ExplainPanel
        isOpen={explainPanelOpen}
        onClose={() => setExplainPanelOpen(false)}
        explanation={explanation}
        isLoading={isExplaining}
      />

      <ChatSidebar
        isOpen={chatSidebarOpen}
        onClose={() => setChatSidebarOpen(false)}
        projectContext={projectData}
        activeFile={activeFile}
      />

      <RefactorResultModal
        isOpen={refactorModalOpen}
        onClose={() => setRefactorModalOpen(false)}
        explanation={refactorResult?.explanation || ''}
        fileName={refactorResult?.fileName || ''}
      />
    </div>
  );
}
