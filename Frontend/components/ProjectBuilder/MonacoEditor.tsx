'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MonacoEditorProps {
  content: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onCursorChange?: (line: number, column: number) => void;
}

export default function MonacoEditor({ content, language = 'plaintext', readOnly = true, onChange, onCursorChange }: MonacoEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalContent(newValue);
    if (onChange) {
      onChange(newValue);
    }
    
    // Calculate cursor position
    if (onCursorChange && textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBeforeCursor = newValue.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      onCursorChange(line, column);
    }
  };

  const handleCursorMove = () => {
    if (onCursorChange && textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBeforeCursor = localContent.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      onCursorChange(line, column);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add line numbers
  const lines = localContent.split('\n');
  const lineNumbers = lines.map((_, i) => i + 1).join('\n');

  return (
    <div className="relative h-full bg-black flex overflow-hidden">
      {/* Line numbers */}
      <div className="bg-[#0D0D0D] text-[#6B7280] text-right py-4 px-3 select-none font-mono text-sm leading-6 overflow-hidden border-r border-[#1F1F1F]">
        <pre className="whitespace-pre">{lineNumbers}</pre>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleChange}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full h-full bg-black text-white font-mono text-sm leading-6 p-4 resize-none outline-none border-none"
          style={{
            tabSize: 2,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          }}
        />
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 p-2 bg-[#1F1F1F] hover:bg-[#2563EB] rounded-lg transition-all duration-200 shadow-lg"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-[#9CA3AF]" />
        )}
      </button>
    </div>
  );
}
