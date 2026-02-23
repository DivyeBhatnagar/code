'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import FileTreeIDE from './FileTreeIDE';
import MonacoEditor from './MonacoEditor';
import LivePreview from './LivePreview';
import ProjectToolbar from './ProjectToolbar';
import ExplainPanel from './ExplainPanel';
import ChatSidebar from './ChatSidebar';
import RefactorResultModal from './RefactorResultModal';
import { explainCode, refactorCode, ExplainCodeResponse } from '@/lib/api';
import { updateGeneratedProject } from '@/lib/firebaseService';
import { Loader2, Check, Eye, EyeOff, Terminal as TerminalIcon, Zap, Activity } from 'lucide-react';

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

interface IDELayoutProps {
  projectData: ProjectData;
  projectId?: string;
  onDownload: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

interface PreviewUpdateRef {
  updatePreview: () => void;
}

export default function IDELayout({ 
  projectData,
  projectId,
  onDownload, 
  onRegenerate,
  isLoading = false 
}: IDELayoutProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState('');
  const [currentFileLanguage, setCurrentFileLanguage] = useState('plaintext');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  
  // Panel states
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [explainPanelOpen, setExplainPanelOpen] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);
  const [refactorModalOpen, setRefactorModalOpen] = useState(false);
  
  // Data states
  const [explanation, setExplanation] = useState<ExplainCodeResponse | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [refactorResult, setRefactorResult] = useState<{ explanation: string; fileName: string } | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const previewUpdateRef = useRef<PreviewUpdateRef | null>(null);

  // Auto-select first HTML/JS file or any file
  useEffect(() => {
    if (projectData.files.length > 0 && !activeFile) {
      const htmlFile = projectData.files.find(f => f.path.endsWith('.html'));
      const jsFile = projectData.files.find(f => f.path.endsWith('.js') || f.path.endsWith('.jsx'));
      const firstFile = htmlFile || jsFile || projectData.files[0];
      
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

  // Debounced auto-save with 500ms delay
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (projectId && hasUnsavedChanges) {
        setIsSaving(true);
        try {
          await updateGeneratedProject(projectId, {
            project_name: projectData.project_name,
            description: projectData.description,
            files: projectData.files,
            dependencies: projectData.dependencies,
            run_commands: projectData.run_commands,
            setup_instructions: projectData.setup_instructions
          });
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
          addConsoleLog('✓ Auto-saved successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
          addConsoleLog('✗ Auto-save failed');
        } finally {
          setIsSaving(false);
        }
      }
    }, 500);
  }, [projectId, hasUnsavedChanges, projectData]);

  const handleContentChange = (newContent: string) => {
    setCurrentFileContent(newContent);
    setHasUnsavedChanges(true);
    
    if (activeFile) {
      const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
      if (fileIndex !== -1) {
        projectData.files[fileIndex].content = newContent;
      }
    }
    
    // Trigger auto-save
    debouncedSave();
    
    // Trigger preview update
    if (previewUpdateRef.current) {
      previewUpdateRef.current.updatePreview();
    }
  };

  const handleCursorChange = (line: number, column: number) => {
    setCursorPosition({ line, column });
  };

  const handleApplyCodeFromChat = (code: string) => {
    handleContentChange(code);
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
        
        const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
        if (fileIndex !== -1) {
          projectData.files[fileIndex].content = updatedFile.content;
        }
        
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

  const addConsoleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${message}`]);
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
    };

    return languageMap[ext || ''] || 'plaintext';
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Toolbar */}
      <ProjectToolbar
        projectName={projectData.project_name}
        projectData={projectData}
        onDownload={onDownload}
        onRegenerate={onRegenerate}
        onExplain={handleExplain}
        onRefactor={handleRefactor}
        onChat={() => setChatSidebarOpen(true)}
        isLoading={isLoading || isRefactoring}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Main IDE Layout - Simple 3 column grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: File Explorer - Fixed width */}
        <div className="w-64 bg-[#0F0F0F] border-r border-[#1F1F1F] flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1F1F1F]">
            <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Explorer</h3>
          </div>
          <FileTreeIDE
            files={projectData.files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* CENTER: Code Editor - Takes remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black">
          {activeFile && (
            <>
              {/* File Tab */}
              <div className="px-4 py-2 bg-[#0F0F0F] border-b border-[#1F1F1F] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-lg border border-[#1F1F1F]">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <span className="text-sm text-white font-medium">{activeFile.split('/').pop()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Auto-save status */}
                  {projectId && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F0F0F] rounded-lg border border-[#1F1F1F]">
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-[#2563EB]" />
                          <span className="text-xs text-[#9CA3AF]">Saving...</span>
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-xs text-[#9CA3AF]">Unsaved</span>
                        </>
                      ) : lastSaved ? (
                        <>
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-[#9CA3AF]">Saved</span>
                        </>
                      ) : null}
                    </div>
                  )}
                  
                  {/* View toggles */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200"
                      title={showPreview ? 'Hide Preview' : 'Show Preview'}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setShowConsole(!showConsole)}
                      className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200"
                      title="Toggle Console"
                    >
                      <TerminalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  content={currentFileContent}
                  language={currentFileLanguage}
                  readOnly={false}
                  onChange={handleContentChange}
                  onCursorChange={handleCursorChange}
                />
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Live Preview - Fixed width, conditionally shown */}
        {showPreview && (
          <div className="w-[500px] bg-[#0F0F0F] border-l border-[#1F1F1F] flex flex-col overflow-hidden">
            <LivePreview
              files={projectData.files}
              activeFile={activeFile}
              showConsole={showConsole}
              consoleLogs={consoleLogs}
              onUpdateRef={(ref: PreviewUpdateRef) => { previewUpdateRef.current = ref; }}
            />
          </div>
        )}
      </div>

      {/* Premium Status Bar */}
      <div className="px-4 py-2 bg-[#0D0D0D] border-t border-[#1F1F1F] flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-[#9CA3AF]">
          <span className="font-medium text-white">{activeFile?.split('/').pop() || 'No file selected'}</span>
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#2563EB]" />
            <span className="text-[#2563EB] font-medium">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium">Auto-Save On</span>
          </div>
          <span className="text-[#9CA3AF]">Frontend</span>
        </div>
      </div>

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
        onApplyCode={handleApplyCodeFromChat}
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
