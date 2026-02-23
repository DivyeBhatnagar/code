'use client';

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { RefreshCw, Globe, Terminal, AlertCircle } from 'lucide-react';

interface LivePreviewProps {
  files: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
  activeFile: string | null;
  showConsole: boolean;
  consoleLogs: string[];
  onUpdateRef?: (ref: { updatePreview: () => void }) => void;
}

export default function LivePreview({ files, activeFile, showConsole, consoleLogs, onUpdateRef }: LivePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Hot reload with 300ms debounce - no full iframe reload
  const updatePreview = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (!iframeRef.current || !iframeRef.current.contentDocument) return;

      const htmlFile = files.find(f => f.path.endsWith('.html') || f.path.endsWith('.htm'));
      const cssFiles = files.filter(f => f.path.endsWith('.css'));
      const jsFiles = files.filter(f => f.path.endsWith('.js') && !f.path.includes('node_modules'));

      if (!htmlFile) {
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(`
          <html>
            <body style="display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: system-ui; background: #000; color: #fff;">
              <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
                <h2 style="color: #fff;">No HTML File Found</h2>
                <p style="color: #9CA3AF;">Add an HTML file to see live preview</p>
              </div>
            </body>
          </html>
        `);
        doc.close();
        return;
      }

      let html = htmlFile.content;

      // Inject CSS
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map(f => f.content).join('\n');
        const styleTag = `<style>${cssContent}</style>`;
        
        if (html.includes('</head>')) {
          html = html.replace('</head>', `${styleTag}</head>`);
        } else if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${styleTag}`);
        } else {
          html = `<head>${styleTag}</head>${html}`;
        }
      }

      // Inject JS
      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map(f => f.content).join('\n');
        const scriptTag = `<script>${jsContent}</script>`;
        
        if (html.includes('</body>')) {
          html = html.replace('</body>', `${scriptTag}</body>`);
        } else {
          html = `${html}${scriptTag}`;
        }
      }

      // Add console capture
      const consoleScript = `
        <script>
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
              originalWarn.apply(console, args);
            };
            
            window.addEventListener('error', function(e) {
              window.parent.postMessage({ type: 'console', level: 'error', message: e.message }, '*');
            });
          })();
        </script>
      `;
      
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${consoleScript}</head>`);
      } else {
        html = `<head>${consoleScript}</head>${html}`;
      }

      // Use contentDocument.write for instant hot reload
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }, 300);
  }, [files]);

  // Expose updatePreview to parent
  useEffect(() => {
    if (onUpdateRef) {
      onUpdateRef({ updatePreview });
    }
  }, [onUpdateRef, updatePreview]);

  // Initial render
  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleRefresh = () => {
    updatePreview();
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0F0F0F] border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'preview'
                ? 'bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F]'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-1" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'console'
                ? 'bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F]'
            }`}
          >
            <Terminal className="w-4 h-4 inline mr-1" />
            Console
            {consoleLogs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#2563EB] text-white text-xs rounded-full">
                {consoleLogs.length}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 text-[#9CA3AF] hover:text-white hover:bg-[#1F1F1F] rounded-lg transition-all duration-200"
          title="Refresh Preview"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Live Preview"
          />
        ) : (
          <div className="h-full overflow-y-auto bg-black p-4 font-mono text-sm">
            {consoleLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#6B7280]">
                <div className="text-center">
                  <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Console is empty</p>
                  <p className="text-xs mt-1">Logs will appear here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {consoleLogs.map((log, index) => (
                  <div
                    key={index}
                    className="text-[#9CA3AF] py-1 px-2 hover:bg-[#1F1F1F] rounded transition-colors"
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-[#2563EB] text-white text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>● Live Preview Active</span>
          <span className="text-blue-100">Hot reload: 300ms</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3 h-3" />
          <span>Frontend Only</span>
        </div>
      </div>
    </div>
  );
}
