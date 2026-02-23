'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createHackathonSession, HackathonSessionCreate } from '@/lib/api';
import { saveHackathonPlan, logUserActivity, getUserStatistics, getRecentActivity } from '@/lib/firebaseService';
import { LogOut, Loader2, Rocket, Code, ArrowLeft, FileText, Sparkles, Activity, Clock, FolderOpen, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import HackathonSetupModal from '@/components/HackathonSetupModal';
import CodeGenerator from '@/components/CodeGenerator';
import PlanView from '@/components/HackathonPlan/PlanView';
import SavedProjectsPanel from '@/components/SavedProjectsPanel';
import CodeEditorLayout from '@/components/ProjectBuilder/CodeEditorLayout';
import Image from 'next/image';

type ViewMode = 'home' | 'plan' | 'code' | 'saved' | 'project';

interface UserStats {
  totalProjects: number;
  activePlans: number;
  aiGenerations: number;
  lastActivity: string;
}

interface RecentActivityItem {
  id: string;
  description: string;
  timeAgo: string;
  action: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [error, setError] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    totalProjects: 0,
    activePlans: 0,
    aiGenerations: 0,
    lastActivity: 'Never'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        
        // Load user statistics
        try {
          setLoadingStats(true);
          const stats = await getUserStatistics();
          setUserStats(stats);
          
          const activities = await getRecentActivity(5);
          setRecentActivity(activities);
        } catch (error) {
          console.error('Failed to load user stats:', error);
        } finally {
          setLoadingStats(false);
        }
      } else if (!loading) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateSession = async (sessionData: HackathonSessionCreate) => {
    setGeneratingPlan(true);
    setError('');

    try {
      const response = await createHackathonSession(sessionData);
      setCurrentPlan(response.data);
      
      try {
        await saveHackathonPlan(response.data);
        await logUserActivity({
          action: 'hackathon_plan_created',
          details: {
            hackathon_name: response.data.hackathon_name,
            session_id: response.data.session_id
          }
        });
      } catch (firebaseError) {
        console.error('Firebase save error:', firebaseError);
      }
      
      setShowSetupModal(false);
      setViewMode('plan');
    } catch (err: any) {
      console.error('Session creation error:', err);
      setError(err.message || 'Failed to create hackathon session');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleOpenProject = (project: any) => {
    setCurrentProject(project);
    setViewMode('project');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center cursor-pointer">
                <Image src="/logo.png" alt="CodePilot AI" width={170} height={170} className="object-contain" />
              </Link>
              {viewMode !== 'home' && (
                <button
                  onClick={() => setViewMode('home')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
          >
            {error}
          </motion.div>
        )}

        {viewMode === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Hero Section - Refined */}
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6"
              >
                <Rocket className="w-4 h-4" />
                🚀 Your AI Hackathon Teammate
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              >
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Developer'}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-600 mb-8"
              >
                Transform your hackathon ideas into structured execution plans with AI-powered guidance.
              </motion.p>

              {/* Primary Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start New Hackathon Plan
                </button>
                <button
                  onClick={() => setViewMode('saved')}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FolderOpen className="w-5 h-5" />
                  View Saved Projects
                </button>
              </motion.div>
            </div>

            {/* Stats Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.totalProjects}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.activePlans}
                </div>
                <div className="text-sm text-gray-600">Active Plans</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.aiGenerations}
                </div>
                <div className="text-sm text-gray-600">AI Generations</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loadingStats ? <Loader2 className="w-6 h-6 animate-spin" /> : userStats.lastActivity}
                </div>
                <div className="text-sm text-gray-600">Last Activity</div>
              </div>
            </motion.div>

            {/* Main Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* AI Code Generator Card */}
              <div
                onClick={() => setViewMode('code')}
                className="group cursor-pointer bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Code Generator</h3>
                <div className="h-px bg-gray-200 my-4"></div>
                <p className="text-gray-600 mb-4">
                  Generate complete project structures with setup instructions and deployment guides
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">Open Generator</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Saved Projects Card */}
              <div
                onClick={() => setViewMode('saved')}
                className="group cursor-pointer bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Saved Projects</h3>
                <div className="h-px bg-gray-200 my-4"></div>
                <p className="text-gray-600 mb-4">
                  View and manage your saved hackathon plans and generated projects
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span className="text-sm">View Saved</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Start creating projects to see your activity here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="relative">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.action.includes('created') ? 'bg-blue-600' :
                          activity.action.includes('generated') ? 'bg-green-600' :
                          activity.action.includes('deleted') ? 'bg-red-600' :
                          'bg-purple-600'
                        }`}></div>
                        {index < recentActivity.length - 1 && (
                          <div className="absolute top-4 left-1 w-px h-12 bg-gray-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {viewMode === 'plan' && currentPlan && (
          <PlanView 
            planData={currentPlan}
            onBack={() => setViewMode('home')}
          />
        )}

        {viewMode === 'code' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CodeGenerator />
          </motion.div>
        )}

        {viewMode === 'saved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SavedProjectsPanel
              onSelectPlan={(plan) => {
                setCurrentPlan(plan);
                setViewMode('plan');
              }}
              onSelectProject={(project) => {
                handleOpenProject(project);
              }}
              onOpenProject={handleOpenProject}
            />
          </motion.div>
        )}

        {viewMode === 'project' && currentProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CodeEditorLayout
              projectData={{
                project_name: currentProject.project_name,
                description: currentProject.description,
                files: currentProject.files || [],
                dependencies: currentProject.dependencies || [],
                run_commands: currentProject.run_commands || [],
                setup_instructions: currentProject.setup_instructions || []
              }}
              projectId={currentProject.id}
              onDownload={async () => {
                const { downloadProjectZip } = await import('@/lib/api');
                try {
                  const blob = await downloadProjectZip(currentProject);
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${currentProject.project_name}.zip`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (err: any) {
                  console.error('Download error:', err);
                  setError(err.message || 'Failed to download project');
                }
              }}
              onRegenerate={() => {
                setCurrentProject(null);
                setViewMode('home');
              }}
            />
          </motion.div>
        )}
      </div>

      <HackathonSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSubmit={handleCreateSession}
        isLoading={generatingPlan}
      />
    </div>
  );
}
