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
