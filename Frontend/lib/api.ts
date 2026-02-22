import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AIRequest {
  type: 'hackathon_analyzer' | 'mvp_planner' | 'pitch_generator' | 'tech_stack_advisor';
  input: string;
}

export interface AIResponse {
  success: boolean;
  type: string;
  result: string;
}

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
}

export async function generateAI(request: AIRequest): Promise<AIResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate AI response');
  }

  return await response.json();
}

export async function verifyAuth(): Promise<any> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify authentication');
  }

  return await response.json();
}

export async function getCurrentUser(): Promise<any> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return await response.json();
}

export async function getSupportedTypes(): Promise<string[]> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/types`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get supported types');
  }

  const data = await response.json();
  return data.supported_types;
}

// Hackathon Session Types
export interface TeamMember {
  name: string;
  skill_strengths: string;
  preferred_role: string;
}

export interface HackathonSessionCreate {
  hackathon_name: string;
  duration_hours: number;
  team_size: number;
  skill_levels: string;
  roles_decided: boolean;
  target_domain: string;
  final_goal: string;
  team_members: TeamMember[];
  problem_statement: string;
}

export interface HackathonPlanResponse {
  success: boolean;
  data: {
    session_id: string;
    hackathon_name: string;
    full_plan: string;
    created_at: string;
  };
}

export interface CodeGenerateRequest {
  prompt: string;
  language: string;
  project_type: string;
}

export interface CodeGenerateResponse {
  success: boolean;
  code_output: string;
  language: string;
  project_type: string;
}

// Hackathon API Functions
export async function createHackathonSession(
  sessionData: HackathonSessionCreate
): Promise<HackathonPlanResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/hackathon/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create hackathon session');
  }

  return await response.json();
}

export async function generateCode(
  request: CodeGenerateRequest
): Promise<CodeGenerateResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/hackathon/generate-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate code');
  }

  return await response.json();
}

// Project Builder Types
export interface FileModel {
  path: string;
  content: string;
  language?: string;
}

export interface ProjectBuildRequest {
  prompt: string;
  language: string;
  project_type: string;
}

export interface ProjectResponse {
  project_name: string;
  description: string;
  files: FileModel[];
  dependencies: string[];
  run_commands: string[];
  setup_instructions: string[];
}

export interface RegenerateFileRequest {
  file_path: string;
  context: string;
  instruction: string;
}

export interface RegenerateFileResponse {
  file_path: string;
  content: string;
  language?: string;
}

// Project Builder API Functions
export async function buildProject(
  request: ProjectBuildRequest
): Promise<ProjectResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/build-project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to build project');
  }

  return await response.json();
}

export async function regenerateFile(
  request: RegenerateFileRequest
): Promise<RegenerateFileResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/regenerate-file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to regenerate file');
  }

  return await response.json();
}

export async function downloadProjectZip(
  projectData: ProjectResponse
): Promise<Blob> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/download-zip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ project_data: projectData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to download project');
  }

  return await response.blob();
}

// New AI Features
export interface ExplainCodeRequest {
  file_path: string;
  content: string;
}

export interface ExplainCodeResponse {
  purpose: string;
  flow: string;
  key_components: string[];
  improvements: string[];
}

export interface RefactorRequest {
  scope: string;
  file_path: string;
  content: string;
  project_context?: any;
}

export interface RefactorResponse {
  updated_files: Array<{
    path: string;
    content: string;
  }>;
  explanation: string;
}

export interface ChatRequest {
  message: string;
  project_context?: any;
  active_file?: string;
}

export interface ChatResponse {
  response: string;
}

export interface ProjectScoreResponse {
  score: number;
  breakdown: {
    tests: number;
    docker: number;
    error_handling: number;
    readme: number;
    security: number;
    structure: number;
    logging: number;
    env_vars: number;
  };
  improvements: string[];
}

export interface PitchResponse {
  problem_statement: string;
  solution_overview: string;
  tech_stack: string;
  architecture_summary: string;
  demo_flow: string;
  future_scope: string;
  "2_min_pitch_script": string;
}

export interface DemoModeResponse {
  problem_explained: string;
  solution_explained: string;
  component_breakdown: string;
  how_to_demo: string;
  judge_impression_tips: string;
  "2_min_script": string;
}

export async function explainCode(request: ExplainCodeRequest): Promise<ExplainCodeResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/explain-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to explain code');
  }

  return await response.json();
}

export async function refactorCode(request: RefactorRequest): Promise<RefactorResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/refactor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to refactor code');
  }

  return await response.json();
}

export async function chatWithAI(request: ChatRequest): Promise<ChatResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to chat with AI');
  }

  return await response.json();
}

export async function getProjectScore(projectStructure: any): Promise<ProjectScoreResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/project-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ project_structure: projectStructure }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get project score');
  }

  return await response.json();
}

export async function generatePitch(projectStructure: any): Promise<PitchResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/generate-pitch-from-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ project_structure: projectStructure }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate pitch');
  }

  return await response.json();
}

export async function getDemoMode(projectStructure: any): Promise<DemoModeResponse> {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_URL}/ai/demo-mode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ project_structure: projectStructure }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get demo mode');
  }

  return await response.json();
}
