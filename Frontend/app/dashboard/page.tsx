'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createHackathonSession, HackathonSessionCreate } from '@/lib/api';
import { LogOut, Loader2, Zap, Rocket, Code, ArrowLeft, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import HackathonSetupModal from '@/components/HackathonSetupModal';
import CodeGenerator from '@/components/CodeGenerator';

type ViewMode = 'home' | 'plan' | 'code';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      setShowSetupModal(false);
      setViewMode('plan');
    } catch (err: any) {
      console.error('Session creation error:', err);
      setError(err.message || 'Failed to create hackathon session');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleExportPlan = () => {
    if (!currentPlan) return;
    
    const content = `# ${currentPlan.hackathon_name}\n\nGenerated: ${new Date(currentPlan.created_at).toLocaleString()}\n\n${currentPlan.full_plan}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlan.hackathon_name.toLowerCase().replace(/\s+/g, '-')}-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
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
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <h1 className="text-lg font-semibold text-gray-900">CodePilot AI</h1>
              </div>
              {viewMode !== 'home' && (
                <button
                  onClick={() => setViewMode('home')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {viewMode === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                Your AI Hackathon Teammate
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Welcome back, {user?.displayName || 'Developer'}!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your hackathon ideas into structured execution plans with AI-powered guidance
              </p>
            </div>

            {/* Primary Action */}
            <div className="max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSetupModal(true)}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-accent to-purple-600 text-white rounded-2xl p-12 shadow-2xl hover:shadow-accent/20 transition-all"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-4 bg-white/20 rounded-2xl mb-4">
                    <Rocket className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Start New Hackathon Plan</h3>
                  <p className="text-white/90 text-lg">
                    Create a comprehensive execution plan with timeline, team roles, and tech stack
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setViewMode('code')}
                className="group p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-600 hover:shadow-xl transition-all text-left"
              >
                <div className="inline-flex p-3 bg-green-600 rounded-xl mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Code Generator</h3>
                <p className="text-gray-600">
                  Generate complete project structures with setup instructions and deployment guides
                </p>
                <div className="mt-4 flex items-center text-green-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Open Generator</span>
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>

              {currentPlan && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setViewMode('plan')}
                  className="group p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-accent hover:shadow-xl transition-all text-left"
                >
                  <div className="inline-flex p-3 bg-accent rounded-xl mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">View Current Plan</h3>
                  <p className="text-gray-600">
                    {currentPlan.hackathon_name}
                  </p>
                  <div className="mt-4 flex items-center text-accent group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Open Plan</span>
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {viewMode === 'plan' && currentPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{currentPlan.hackathon_name}</h2>
                <p className="text-gray-600 mt-1">
                  Generated {new Date(currentPlan.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleExportPlan}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Plan
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {currentPlan.full_plan}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'code' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CodeGenerator />
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

