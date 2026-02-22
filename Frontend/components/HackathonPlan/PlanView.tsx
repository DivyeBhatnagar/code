'use client';

import { useState } from 'react';
import { buildProject } from '@/lib/api';
import { saveGeneratedProject, logUserActivity } from '@/lib/firebaseService';
import { parsePlan, ParsedPlan } from '@/lib/planParser';
import PlanHeaderCard from './PlanHeaderCard';
import ActionButtonsBar from './ActionButtonsBar';
import TimelineCard from './TimelineCard';
import TeamRolesCard from './TeamRolesCard';
import MVPScopeCard from './MVPScopeCard';
import TechStackCard from './TechStackCard';
import RiskCard from './RiskCard';
import KickstartGuideCard from './KickstartGuideCard';
import FolderStructureCard from './FolderStructureCard';
import DemoScriptCard from './DemoScriptCard';
import CodeEditorLayout from '../ProjectBuilder/CodeEditorLayout';
import LoadingOverlay from '../ProjectBuilder/LoadingOverlay';
import { downloadProjectZip } from '@/lib/api';

interface PlanViewProps {
  planData: {
    session_id: string;
    hackathon_name: string;
    full_plan: string;
    created_at: string;
  };
  onBack: () => void;
}

export default function PlanView({ planData, onBack }: PlanViewProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState('');

  // Parse the plain text plan into structured data
  const parsedPlan: ParsedPlan = parsePlan(
    planData.full_plan,
    planData.hackathon_name,
    planData.created_at
  );

  const handleStartBuilding = async () => {
    setIsBuilding(true);
    setError('');

    try {
      const buildData = parsedPlan.buildData;
      
      // Create detailed prompt from plan data
      const prompt = `Build a ${buildData.buildType} project: ${buildData.projectName}

Core Features:
${buildData.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Tech Stack: ${buildData.techStack.join(', ')}

Additional Context:
- MVP Scope: ${parsedPlan.mvpScope.coreFeatures.join(', ')}
- Project Type: ${buildData.projectType}

Create a complete, production-ready project structure with all necessary files, dependencies, and setup instructions.`;

      const response = await buildProject({
        prompt,
        language: buildData.primaryLanguage,
        project_type: buildData.projectType
      });

      setProjectData(response);
      setShowEditor(true);
      
      // Save to Firebase
      try {
        await saveGeneratedProject({
          ...response,
          session_id: planData.session_id
        });
        await logUserActivity({
          action: 'project_built',
          details: {
            project_name: response.project_name,
            language: buildData.primaryLanguage,
            project_type: buildData.projectType
          }
        });
      } catch (firebaseError) {
        console.error('Firebase save error:', firebaseError);
        // Continue even if Firebase save fails
      }
    } catch (err: any) {
      console.error('Build error:', err);
      setError(err.message || 'Failed to build project');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownload = async () => {
    if (!projectData) return;

    try {
      const blob = await downloadProjectZip(projectData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectData.project_name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download project');
    }
  };

  const handleBackToForm = () => {
    setShowEditor(false);
    setProjectData(null);
  };

  const handleOptimizePlan = async () => {
    setIsOptimizing(true);
    // Simulate optimization
    setTimeout(() => {
      setIsOptimizing(false);
      alert('Plan optimized! Timeline and roles have been rebalanced.');
    }, 2000);
  };

  // Show code editor if project is built
  if (showEditor && projectData) {
    return (
      <CodeEditorLayout
        projectData={projectData}
        onDownload={handleDownload}
        onRegenerate={handleBackToForm}
        onPitch={() => {}}
      />
    );
  }

  return (
    <>
      {isBuilding && <LoadingOverlay />}
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Header */}
          <PlanHeaderCard
            projectName={parsedPlan.projectName}
            generatedDate={parsedPlan.generatedDate}
          />

          {/* Action Buttons */}
          <ActionButtonsBar
            onStartBuilding={handleStartBuilding}
            onOptimizePlan={handleOptimizePlan}
            isOptimizing={isOptimizing}
            isBuilding={isBuilding}
          />

          {/* Timeline */}
          <TimelineCard timeline={parsedPlan.timeline} />

          {/* Team Roles */}
          {parsedPlan.teamMembers.length > 0 && (
            <TeamRolesCard teamMembers={parsedPlan.teamMembers} />
          )}

          {/* MVP Scope */}
          <MVPScopeCard
            coreFeatures={parsedPlan.mvpScope.coreFeatures}
            optionalFeatures={parsedPlan.mvpScope.optionalFeatures}
            stretchGoals={parsedPlan.mvpScope.stretchGoals}
          />

          {/* Tech Stack */}
          <TechStackCard
            frontend={parsedPlan.techStack.frontend}
            backend={parsedPlan.techStack.backend}
            deployment={parsedPlan.techStack.deployment}
            tools={parsedPlan.techStack.tools}
          />

          {/* Risks */}
          <RiskCard risks={parsedPlan.risks} />

          {/* Kickstart Guide */}
          <KickstartGuideCard
            backendSteps={parsedPlan.kickstartGuide.backendSteps}
            frontendSteps={parsedPlan.kickstartGuide.frontendSteps}
          />

          {/* Folder Structure */}
          <FolderStructureCard structure={parsedPlan.folderStructure} />

          {/* Demo Script */}
          <DemoScriptCard sections={parsedPlan.demoScript} />
        </div>
      </div>
    </>
  );
}
