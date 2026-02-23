'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

interface FileTreeIDEProps {
  files: Array<{
    path: string;
    content: string;
    language?: string;
  }>;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  content?: string;
}

export default function FileTreeIDE({ files, activeFile, onFileSelect }: FileTreeIDEProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  // Build tree structure from flat file list
  const buildTree = (): TreeNode[] => {
    const root: TreeNode[] = [];
    const folderMap = new Map<string, TreeNode>();

    files.forEach(file => {
      const parts = file.path.split('/').filter(Boolean);
      let currentPath = '';
      let currentLevel = root;

      parts.forEach((part, index) => {
        currentPath += '/' + part;
        const isFile = index === parts.length - 1;

        if (isFile) {
          currentLevel.push({
            name: part,
            path: file.path,
            type: 'file',
            content: file.content
          });
        } else {
          let folder = folderMap.get(currentPath);
          if (!folder) {
            folder = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: []
            };
            folderMap.set(currentPath, folder);
            currentLevel.push(folder);
          }
          currentLevel = folder.children!;
        }
      });
    });

    return root;
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'html': '🌐',
      'css': '🎨',
      'js': '📜',
      'jsx': '⚛️',
      'ts': '📘',
      'tsx': '⚛️',
      'py': '🐍',
      'json': '📋',
      'md': '📝',
      'txt': '📄',
      'yml': '⚙️',
      'yaml': '⚙️',
      'sh': '🔧',
    };
    return iconMap[ext || ''] || '📄';
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isActive = activeFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1F1F1F] cursor-pointer text-[#9CA3AF] text-sm transition-all duration-200 group"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
            )}
            <span className="truncate group-hover:text-white transition-colors">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        onClick={() => onFileSelect(node.path)}
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer text-sm transition-all duration-200 group ${
          isActive
            ? 'bg-[#1F1F1F] text-white border-l-2 border-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.3)]'
            : 'text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-white'
        }`}
        style={{ paddingLeft: `${level * 12 + 28}px` }}
      >
        <span className="text-base">{getFileIcon(node.name)}</span>
        <span className="truncate">{node.name}</span>
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="py-2">
        {tree.map(node => renderNode(node))}
      </div>
    </div>
  );
}
