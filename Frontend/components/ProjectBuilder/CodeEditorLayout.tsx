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
import { updateGeneratedProject } from '@/lib/firebaseService';
import { Loader2, Undo, Redo, Save, Check } from 'lucide-react';

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
  projectId?: string;
  onDownload: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export default function CodeEditorLayout({ 
  projectData,
  projectId,
  onDownload, 
  onRegenerate,
  isLoading = false 
}: CodeEditorLayoutProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState('');
  const [currentFileLanguage, setCurrentFileLanguage] = useState('plaintext');
  const [contentHistory, setContentHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (projectId && hasUnsavedChanges) {
          handleSave();
        }
      }
      // Ctrl+Z or Cmd+Z to undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y or Cmd+Shift+Z to redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, hasUnsavedChanges, historyIndex, contentHistory]);

  const handleFileSelect = (path: string) => {
    const file = projectData.files.find(f => f.path === path);
    if (file) {
      setActiveFile(path);
      setCurrentFileContent(file.content);
      setCurrentFileLanguage(getLanguageFromPath(file.path, file.language));
      // Initialize history with current content
      setContentHistory([file.content]);
      setHistoryIndex(0);
    }
  };

  const handleContentChange = (newContent: string) => {
    setCurrentFileContent(newContent);
    setHasUnsavedChanges(true);
    
    // Update project data
    if (activeFile) {
      const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
      if (fileIndex !== -1) {
        projectData.files[fileIndex].content = newContent;
      }
    }
    
    // Add to history
    const newHistory = contentHistory.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setContentHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !projectId) return;

    const autoSaveTimer = setTimeout(async () => {
      await handleSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFileContent, hasUnsavedChanges, projectId]);

  const handleSave = async () => {
    if (!projectId) return;

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
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousContent = contentHistory[newIndex];
      setCurrentFileContent(previousContent);
      
      // Update project data
      if (activeFile) {
        const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
        if (fileIndex !== -1) {
          projectData.files[fileIndex].content = previousContent;
        }
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < contentHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextContent = contentHistory[newIndex];
      setCurrentFileContent(nextContent);
      
      // Update project data
      if (activeFile) {
        const fileIndex = projectData.files.findIndex(f => f.path === activeFile);
        if (fileIndex !== -1) {
          projectData.files[fileIndex].content = nextContent;
        }
      }
    }
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
                <div className="flex items-center gap-3">
                  {/* Save Status */}
                  {projectId && (
                    <div className="flex items-center gap-2 text-xs">
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                          <span className="text-blue-400">Saving...</span>
                        </>
                      ) : hasUnsavedChanges ? (
                        <span className="text-yellow-400">Unsaved changes</span>
                      ) : lastSaved ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">
                            Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </>
                      ) : null}
                    </div>
                  )}
                  
                  {isRefactoring && (
                    <div className="flex items-center gap-2 text-xs text-yellow-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Refactoring...
                    </div>
                  )}
                  
                  {/* Undo/Redo */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={historyIndex >= contentHistory.length - 1}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                    {projectId && (
                      <button
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges || isSaving}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Save (Ctrl+S)"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <MonacoEditor
                  content={currentFileContent}
                  language={currentFileLanguage}
                  readOnly={false}
                  onChange={handleContentChange}
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
