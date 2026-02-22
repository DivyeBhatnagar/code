'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Sparkles, Loader2 } from 'lucide-react';
import { buildProject, downloadProjectZip, generatePitch, ProjectBuildRequest, ProjectResponse, PitchResponse } from '@/lib/api';
import CodeEditorLayout from './ProjectBuilder/CodeEditorLayout';
import LoadingOverlay from './ProjectBuilder/LoadingOverlay';
import PitchModal from './ProjectBuilder/PitchModal';

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [projectType, setProjectType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  
  // Pitch state
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [pitchData, setPitchData] = useState<PitchResponse | null>(null);
  const [loadingPitch, setLoadingPitch] = useState(false);

  const languages = [
    'python', 'javascript', 'typescript', 'react', 'nextjs', 
    'fastapi', 'nodejs', 'vue', 'django', 'flask', 'go', 'rust'
  ];

  const projectTypes = [
    'backend', 'frontend', 'fullstack', 'api', 
    'microservice', 'cli', 'mobile', 'desktop'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !language || !projectType) {
      setError('Please fill in all fields');
      return;
    }

    setGenerating(true);
    setError('');
    setProjectData(null);
    setShowEditor(false);

    try {
      const request: ProjectBuildRequest = {
        prompt: prompt.trim(),
        language: language.toLowerCase(),
        project_type: projectType.toLowerCase()
      };

      const response = await buildProject(request);
      setProjectData(response);
      setShowEditor(true);
    } catch (err: any) {
      console.error('Project build error:', err);
      setError(err.message || 'Failed to build project');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!projectData) return;

    try {
      const blob = await downloadProjectZip(projectData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.project_name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download project');
    }
  };

  const handleRegenerate = () => {
    setShowEditor(false);
    setProjectData(null);
  };

  const handleBackToForm = () => {
    setShowEditor(false);
    setProjectData(null);
  };

  const handlePitch = async () => {
    if (!projectData) return;
    
    setLoadingPitch(true);
    setPitchModalOpen(true);
    
    try {
      const result = await generatePitch(projectData);
      setPitchData(result);
    } catch (err: any) {
      console.error('Pitch generation error:', err);
      setError(err.message || 'Failed to generate pitch');
      setPitchModalOpen(false);
    } finally {
      setLoadingPitch(false);
    }
  };

  if (showEditor && projectData) {
    return (
      <>
        <CodeEditorLayout
          projectData={projectData}
          onDownload={handleDownload}
          onRegenerate={handleBackToForm}
          onPitch={handlePitch}
        />
        
        <PitchModal
          isOpen={pitchModalOpen}
          onClose={() => setPitchModalOpen(false)}
          pitchData={pitchData}
          isLoading={loadingPitch}
        />
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {generating && <LoadingOverlay />}
      </AnimatePresence>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent rounded-xl">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Project Builder</h2>
            <p className="text-gray-600">Generate complete project structures with code editor</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project in detail... e.g., 'Create a FastAPI backend with JWT authentication, user management, and PostgreSQL database'"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select language...</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select type...</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || !language || !projectType}
            className="w-full py-4 px-6 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Building Project...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Build Project with AI
              </>
            )}
          </button>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>New:</strong> AI will generate a complete project with file structure, 
              code editor, dependencies, and setup instructions. You can download everything as a ZIP file.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
