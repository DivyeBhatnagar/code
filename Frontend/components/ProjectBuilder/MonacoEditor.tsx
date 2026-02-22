'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MonacoEditorProps {
  content: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export default function MonacoEditor({ content, language = 'plaintext', readOnly = true, onChange }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let editorInstance: any = null;

    const initMonaco = async () => {
      if (!editorRef.current) return;

      try {
        // Dynamic import for Monaco Editor
        const monaco = await import('monaco-editor');
        
        if (!mounted || !editorRef.current) return;

        // Create editor instance
        editorInstance = monaco.editor.create(editorRef.current, {
          value: content,
          language: language,
          theme: 'vs-dark',
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
        });

        if (onChange) {
          editorInstance.onDidChangeModelContent(() => {
            onChange(editorInstance.getValue());
          });
        }

        setEditor(editorInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        setIsLoading(false);
      }
    };

    initMonaco();

    return () => {
      mounted = false;
      if (editorInstance) {
        editorInstance.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editor && content !== editor.getValue()) {
      editor.setValue(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && language) {
      const model = editor.getModel();
      if (model) {
        import('monaco-editor').then(monaco => {
          monaco.editor.setModelLanguage(model, language);
        });
      }
    }
  }, [language, editor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full bg-gray-900">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Loading editor...
        </div>
      )}
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
