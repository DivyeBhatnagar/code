'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Users, Target } from 'lucide-react';
import { HackathonSessionCreate, TeamMember } from '@/lib/api';

interface HackathonSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HackathonSessionCreate) => void;
  isLoading: boolean;
}

export default function HackathonSetupModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}: HackathonSetupModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<HackathonSessionCreate>({
    hackathon_name: '',
    duration_hours: 24,
    team_size: 1,
    skill_levels: '',
    roles_decided: false,
    target_domain: '',
    final_goal: '',
    team_members: [],
    problem_statement: ''
  });

  const domains = [
    'AI/ML', 'Web3/Blockchain', 'HealthTech', 'FinTech', 
    'EdTech', 'E-commerce', 'Social Impact', 'Gaming', 'Other'
  ];

  const goals = [
    'Winning the Hackathon', 'Learning New Tech', 'Building MVP', 
    'Startup Launch', 'Portfolio Project', 'Networking'
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...formData.team_members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, team_members: newMembers });
  };

  const initializeTeamMembers = (size: number) => {
    const members: TeamMember[] = [];
    for (let i = 0; i < size; i++) {
      members.push({
        name: '',
        skill_strengths: '',
        preferred_role: ''
      });
    }
    setFormData({ ...formData, team_size: size, team_members: members });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Start New Hackathon</h2>
                  <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pt-4">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        s <= step ? 'bg-accent' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold text-gray-900">Project Setup</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hackathon Name
                        </label>
                        <input
                          type="text"
                          value={formData.hackathon_name}
                          onChange={(e) => setFormData({ ...formData, hackathon_name: e.target.value })}
                          placeholder="e.g., AI Healthcare Assistant"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Problem Statement
                        </label>
                        <textarea
                          value={formData.problem_statement}
                          onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                          placeholder="Describe the problem you're solving..."
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (hours)
                          </label>
                          <input
                            type="number"
                            value={formData.duration_hours}
                            onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                            min="1"
                            max="72"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Size
                          </label>
                          <input
                            type="number"
                            value={formData.team_size}
                            onChange={(e) => initializeTeamMembers(parseInt(e.target.value))}
                            min="1"
                            max="10"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Domain
                        </label>
                        <select
                          value={formData.target_domain}
                          onChange={(e) => setFormData({ ...formData, target_domain: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                          <option value="">Select domain...</option>
                          {domains.map((domain) => (
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Final Goal
                        </label>
                        <select
                          value={formData.final_goal}
                          onChange={(e) => setFormData({ ...formData, final_goal: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                          <option value="">Select goal...</option>
                          {goals.map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team Skill Levels
                        </label>
                        <input
                          type="text"
                          value={formData.skill_levels}
                          onChange={(e) => setFormData({ ...formData, skill_levels: e.target.value })}
                          placeholder="e.g., 2 intermediate, 1 beginner"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold text-gray-900">Team Configuration</h3>
                      </div>

                      {formData.team_members.map((member, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <h4 className="font-medium text-gray-900">Member {index + 1}</h4>
                          
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            placeholder="Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            value={member.skill_strengths}
                            onChange={(e) => updateTeamMember(index, 'skill_strengths', e.target.value)}
                            placeholder="Skill strengths (e.g., React, Python, UI/UX)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                          
                          <input
                            type="text"
                            value={member.preferred_role}
                            onChange={(e) => updateTeamMember(index, 'preferred_role', e.target.value)}
                            placeholder="Preferred role (e.g., Frontend, Backend, Design)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-semibold text-gray-900">Review & Generate</h3>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Hackathon Name</p>
                          <p className="text-gray-900">{formData.hackathon_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Duration</p>
                          <p className="text-gray-900">{formData.duration_hours} hours</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Team Size</p>
                          <p className="text-gray-900">{formData.team_size} members</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Domain</p>
                          <p className="text-gray-900">{formData.target_domain}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Goal</p>
                          <p className="text-gray-900">{formData.final_goal}</p>
                        </div>
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                          AI will generate a comprehensive execution plan including timeline, team roles, 
                          MVP scope, tech stack recommendations, and risk analysis.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Plan
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
