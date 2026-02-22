'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Download, Sparkles, Loader2, Check } from 'lucide-react';
import { generateCode, CodeGenerateRequest } from '@/lib/api';

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [projectType, setProjectType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const languages = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 
    'FastAPI', 'Node.js', 'Vue.js', 'Django', 'Flask'
  ];

  const projectTypes = [
    'Web App', 'API', 'Mobile App', 'CLI Tool', 
    'Microservice', 'Full Stack', 'Frontend', 'Backend'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || !language || !projectType) {
      setError('Please fill in all fields');
      return;
    }

    setGenerating(true);
    setError('');
    setResult('');

    try {
      const request: CodeGenerateRequest = {
        prompt: prompt.trim(),
        language,
        project_type: projectType
      };

      const response = await generateCode(request);
      setResult(response.code_output);
    } catch (err: any) {
      console.error('Code generation error:', err);
      setError(err.message || 'Failed to generate code');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectType.toLowerCase().replace(/\s+/g, '-')}-code.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-600 rounded-xl">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Code Generator</h2>
          <p className="text-gray-600">Generate complete project structures with setup instructions</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project in detail..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language/Framework
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="">Select language...</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="">Select type...</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim() || !language || !projectType}
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Code
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Generated Code
            </label>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-6 overflow-auto h-[400px] font-mono text-sm">
            {generating ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              </div>
            ) : result ? (
              <pre className="text-green-400 whitespace-pre-wrap">{result}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Your generated code will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
