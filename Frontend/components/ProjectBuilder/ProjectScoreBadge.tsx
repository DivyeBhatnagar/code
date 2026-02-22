'use client';

import { useState, useEffect } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { getProjectScore, ProjectScoreResponse } from '@/lib/api';

interface ProjectScoreBadgeProps {
  projectData: any;
  onClick: () => void;
}

export default function ProjectScoreBadge({ projectData, onClick }: ProjectScoreBadgeProps) {
  const [score, setScore] = useState<ProjectScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadScore = async () => {
    setIsLoading(true);
    try {
      const result = await getProjectScore(projectData);
      setScore(result);
    } catch (error) {
      console.error('Failed to load score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all hover:shadow-md ${
        score ? getScoreBg(score.score) : 'bg-gray-50 border-gray-200'
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Loading...</span>
        </>
      ) : score ? (
        <>
          <Shield className={`w-5 h-5 ${getScoreColor(score.score)}`} />
          <div className="text-left">
            <div className="text-xs text-gray-600">Health Score</div>
            <div className={`text-lg font-bold ${getScoreColor(score.score)}`}>
              {score.score}/100
            </div>
          </div>
        </>
      ) : (
        <>
          <Shield className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Check Health</span>
        </>
      )}
    </button>
  );
}
