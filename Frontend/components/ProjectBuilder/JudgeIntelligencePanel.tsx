'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Play,
  Pause
} from 'lucide-react';

interface JudgeQuestion {
  question: string;
  why_judges_ask: string;
  basic_answer: string;
  advanced_answer: string;
  power_answer: string;
}

interface ProjectWeakness {
  area: string;
  severity: string;
  issue: string;
  improvement: string;
}

interface JudgeIntelligenceData {
  questions_by_category: {
    [key: string]: JudgeQuestion[];
  };
  weaknesses: ProjectWeakness[];
  confidence_score: number;
  risk_level: string;
  improvement_areas: string[];
  strategic_insights: string;
}

interface JudgeIntelligencePanelProps {
  projectData: any;
  problemStatement?: string;
  solutionDescription?: string;
  businessModel?: string;
  onGenerate: (data: JudgeIntelligenceData) => void;
  isLoading: boolean;
}

export default function JudgeIntelligencePanel({
  projectData,
  problemStatement,
  solutionDescription,
  businessModel,
  onGenerate,
  isLoading
}: JudgeIntelligencePanelProps) {
  const [data, setData] = useState<JudgeIntelligenceData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [answerLevel, setAnswerLevel] = useState<'basic' | 'advanced' | 'power'>('power');
  const [simulationMode, setSimulationMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [simulationTimer, setSimulationTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const categoryIcons: { [key: string]: any } = {
    problem_understanding: Target,
    solution_clarity: Zap,
    technical_feasibility: Shield,
    mvp_scope: CheckCircle2,
    execution_strategy: TrendingUp,
    scalability: TrendingUp,
    market_potential: TrendingUp,
    differentiation: Brain
  };

  const categoryLabels: { [key: string]: string } = {
    problem_understanding: 'Problem Understanding',
    solution_clarity: 'Solution Clarity',
    technical_feasibility: 'Technical Feasibility',
    mvp_scope: 'MVP Scope',
    execution_strategy: 'Execution Strategy',
    scalability: 'Scalability',
    market_potential: 'Market Potential',
    differentiation: 'Differentiation'
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAllQuestions = () => {
    if (!data) return [];
    const questions: Array<{ category: string; question: JudgeQuestion }> = [];
    Object.entries(data.questions_by_category).forEach(([category, qs]) => {
      qs.forEach(q => questions.push({ category, question: q }));
    });
    return questions;
  };

  const startSimulation = () => {
    setSimulationMode(true);
    setCurrentQuestionIndex(0);
    setSimulationTimer(30);
    setIsTimerRunning(true);
  };

  const nextQuestion = () => {
    const allQuestions = getAllQuestions();
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSimulationTimer(30);
      setIsTimerRunning(true);
    } else {
      setSimulationMode(false);
      setIsTimerRunning(false);
    }
  };

  if (!data && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Brain className="w-16 h-16 text-[#2563EB] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Judge Intelligence Engine</h3>
          <p className="text-[#9CA3AF] mb-6">
            Get AI-powered predictions of judge questions, strategic answers, and weakness analysis
            tailored to your specific project.
          </p>
          <button
            onClick={() => onGenerate(data!)}
            disabled={isLoading}
            className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Brain className="w-5 h-5" />
            Predict Judge Questions
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Analyzing your project and generating judge intelligence...</p>
        </div>
      </div>
    );
  }

  if (simulationMode && data) {
    const allQuestions = getAllQuestions();
    const current = allQuestions[currentQuestionIndex];

    return (
      <div className="h-full flex flex-col bg-[#0F0F0F] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg font-semibold text-white">Simulation Mode</h3>
          </div>
          <button
            onClick={() => setSimulationMode(false)}
            className="px-4 py-2 bg-[#1F1F1F] text-white rounded-lg hover:bg-[#2F2F2F] transition-colors"
          >
            Exit Simulation
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Timer */}
            <div className="mb-8 text-center">
              <div className={`text-6xl font-bold ${simulationTimer <= 10 ? 'text-red-500' : 'text-[#2563EB]'}`}>
                {simulationTimer}s
              </div>
              <p className="text-[#9CA3AF] mt-2">Time to prepare your answer</p>
            </div>

            {/* Question Card */}
            <div className="bg-black border border-[#1F1F1F] rounded-lg p-8 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#2563EB] font-semibold">{currentQuestionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#9CA3AF] mb-2">
                    {categoryLabels[current.category]}
                  </div>
                  <p className="text-xl text-white font-medium leading-relaxed">
                    {current.question.question}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#0F0F0F] rounded-lg border border-[#1F1F1F]">
                <p className="text-sm text-[#9CA3AF] mb-2">Why judges ask this:</p>
                <p className="text-sm text-white">{current.question.why_judges_ask}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 px-6 py-3 bg-[#1F1F1F] text-white rounded-lg hover:bg-[#2F2F2F] transition-colors flex items-center justify-center gap-2"
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={nextQuestion}
                className="flex-1 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 transition-colors"
              >
                {currentQuestionIndex < allQuestions.length - 1 ? 'Next Question' : 'Finish'}
              </button>
            </div>

            {/* Progress */}
            <div className="mt-6 text-center text-sm text-[#9CA3AF]">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0F0F0F]">
      {/* Header */}
      <div className="p-6 border-b border-[#1F1F1F]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-[#2563EB]" />
            <h3 className="text-lg font-semibold text-white">Judge Intelligence</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startSimulation}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 transition-colors flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Simulation Mode
            </button>
            <button
              onClick={() => onGenerate(data!)}
              disabled={isLoading}
              className="p-2 bg-[#1F1F1F] text-white rounded-lg hover:bg-[#2F2F2F] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black border border-[#1F1F1F] rounded-lg p-4">
            <div className="text-xs text-[#9CA3AF] mb-1">Readiness Score</div>
            <div className={`text-2xl font-bold ${getScoreColor(data.confidence_score)}`}>
              {data.confidence_score}/100
            </div>
          </div>
          <div className="bg-black border border-[#1F1F1F] rounded-lg p-4">
            <div className="text-xs text-[#9CA3AF] mb-1">Risk Level</div>
            <div className={`text-2xl font-bold ${getRiskColor(data.risk_level)}`}>
              {data.risk_level}
            </div>
          </div>
          <div className="bg-black border border-[#1F1F1F] rounded-lg p-4">
            <div className="text-xs text-[#9CA3AF] mb-1">Total Questions</div>
            <div className="text-2xl font-bold text-[#2563EB]">
              {Object.values(data.questions_by_category).reduce((sum, qs) => sum + qs.length, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Strategic Insights */}
        <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Strategic Insights</h4>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{data.strategic_insights}</p>
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        {data.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Identified Weaknesses
            </h4>
            <div className="space-y-3">
              {data.weaknesses.map((weakness, idx) => (
                <div key={idx} className="bg-black border border-[#1F1F1F] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-white">{weakness.area}</h5>
                    <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(weakness.severity)}`}>
                      {weakness.severity}
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-3">{weakness.issue}</p>
                  <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded p-3">
                    <p className="text-xs text-[#9CA3AF] mb-1">How to improve:</p>
                    <p className="text-sm text-white">{weakness.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Level Selector */}
        <div className="flex items-center gap-2 p-3 bg-black border border-[#1F1F1F] rounded-lg">
          <span className="text-sm text-[#9CA3AF]">Show answers:</span>
          <div className="flex gap-2">
            {(['basic', 'advanced', 'power'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setAnswerLevel(level)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  answerLevel === level
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#1F1F1F] text-[#9CA3AF] hover:bg-[#2F2F2F]'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Questions by Category */}
        <div className="space-y-4">
          {Object.entries(data.questions_by_category).map(([category, questions]) => {
            const Icon = categoryIcons[category] || Brain;
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="bg-black border border-[#1F1F1F] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1F1F1F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#2563EB]" />
                    <span className="text-sm font-medium text-white">{categoryLabels[category]}</span>
                    <span className="text-xs text-[#9CA3AF]">({questions.length})</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#9CA3AF]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3 border-t border-[#1F1F1F]">
                        {questions.map((q, idx) => {
                          const questionId = `${category}-${idx}`;
                          const isQuestionExpanded = expandedQuestions.has(questionId);

                          return (
                            <div key={idx} className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleQuestion(questionId)}
                                className="w-full px-4 py-3 text-left hover:bg-[#1F1F1F] transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-[#2563EB] font-semibold">{idx + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-white font-medium leading-relaxed">{q.question}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-1">{q.why_judges_ask}</p>
                                  </div>
                                  {isQuestionExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-1" />
                                  )}
                                </div>
                              </button>

                              <AnimatePresence>
                                {isQuestionExpanded && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4 border-t border-[#1F1F1F]">
                                      <div className="mt-3 p-4 bg-black rounded-lg border border-[#1F1F1F]">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-xs font-semibold text-[#2563EB] uppercase">
                                            {answerLevel} Answer
                                          </span>
                                          <button
                                            onClick={() => copyToClipboard(
                                              answerLevel === 'basic' ? q.basic_answer :
                                              answerLevel === 'advanced' ? q.advanced_answer :
                                              q.power_answer
                                            )}
                                            className="p-1 hover:bg-[#1F1F1F] rounded transition-colors"
                                          >
                                            <Copy className="w-3 h-3 text-[#9CA3AF]" />
                                          </button>
                                        </div>
                                        <p className="text-sm text-white leading-relaxed">
                                          {answerLevel === 'basic' ? q.basic_answer :
                                           answerLevel === 'advanced' ? q.advanced_answer :
                                           q.power_answer}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Improvement Areas */}
        {data.improvement_areas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Priority Improvements</h4>
            <div className="space-y-2">
              {data.improvement_areas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-black border border-[#1F1F1F] rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{area}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
