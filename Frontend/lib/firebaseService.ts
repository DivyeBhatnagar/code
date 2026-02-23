import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from './firebase';

const db = getFirestore();

// Save hackathon plan to Firestore
export async function saveHackathonPlan(planData: {
  session_id: string;
  hackathon_name: string;
  full_plan: string;
  created_at: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const planRef = doc(db, 'users', user.uid, 'hackathon_plans', planData.session_id);
  
  await setDoc(planRef, {
    ...planData,
    user_id: user.uid,
    user_email: user.email,
    updated_at: serverTimestamp(),
    status: 'active'
  });

  return planData.session_id;
}

// Get all hackathon plans for current user
export async function getUserHackathonPlans() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const plansRef = collection(db, 'users', user.uid, 'hackathon_plans');
  const q = query(plansRef, where('status', '!=', 'deleted'));
  const querySnapshot = await getDocs(q);

  const plans: any[] = [];
  querySnapshot.forEach((doc) => {
    plans.push({ id: doc.id, ...doc.data() });
  });

  return plans.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
}

// Get specific hackathon plan
export async function getHackathonPlan(sessionId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const planRef = doc(db, 'users', user.uid, 'hackathon_plans', sessionId);
  const planDoc = await getDoc(planRef);

  if (!planDoc.exists()) {
    throw new Error('Plan not found');
  }

  return { id: planDoc.id, ...planDoc.data() };
}

// Save generated project to Firestore
export async function saveGeneratedProject(projectData: {
  project_name: string;
  description: string;
  files: any[];
  dependencies: string[];
  run_commands: string[];
  setup_instructions: string[];
  session_id?: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectId = `project_${Date.now()}`;
  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);

  await setDoc(projectRef, {
    ...projectData,
    user_id: user.uid,
    user_email: user.email,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    status: 'active'
  });

  return projectId;
}

// Update existing project (for auto-save)
export async function updateGeneratedProject(projectId: string, projectData: {
  project_name: string;
  description: string;
  files: any[];
  dependencies: string[];
  run_commands: string[];
  setup_instructions: string[];
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);

  await updateDoc(projectRef, {
    ...projectData,
    updated_at: serverTimestamp()
  });

  return projectId;
}

// Get specific project by ID
export async function getGeneratedProject(projectId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (!projectDoc.exists()) {
    throw new Error('Project not found');
  }

  return { id: projectDoc.id, ...projectDoc.data() };
}

// Get all generated projects for current user
export async function getUserGeneratedProjects() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectsRef = collection(db, 'users', user.uid, 'generated_projects');
  const q = query(projectsRef, where('status', '!=', 'deleted'));
  const querySnapshot = await getDocs(q);

  const projects: any[] = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });

  return projects.sort((a, b) => {
    const dateA = a.created_at ? a.created_at.toDate().getTime() : 0;
    const dateB = b.created_at ? b.created_at.toDate().getTime() : 0;
    return dateB - dateA;
  });
}

// Update project status
export async function updateProjectStatus(projectId: string, status: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);
  
  await updateDoc(projectRef, {
    status,
    updated_at: serverTimestamp()
  });
}

// Delete hackathon plan
export async function deleteHackathonPlan(sessionId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const planRef = doc(db, 'users', user.uid, 'hackathon_plans', sessionId);
  
  // Log deletion activity before deleting
  await logUserActivity({
    action: 'hackathon_plan_deleted',
    details: {
      session_id: sessionId
    }
  });

  // Delete the plan
  await setDoc(planRef, {
    status: 'deleted',
    deleted_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }, { merge: true });
}

// Delete generated project
export async function deleteGeneratedProject(projectId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);
  
  // Log deletion activity before deleting
  await logUserActivity({
    action: 'project_deleted',
    details: {
      project_id: projectId
    }
  });

  // Soft delete - mark as deleted instead of removing
  await setDoc(projectRef, {
    status: 'deleted',
    deleted_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }, { merge: true });
}

// Permanently delete hackathon plan (hard delete)
export async function permanentlyDeleteHackathonPlan(sessionId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const planRef = doc(db, 'users', user.uid, 'hackathon_plans', sessionId);
  
  // Log permanent deletion
  await logUserActivity({
    action: 'hackathon_plan_permanently_deleted',
    details: {
      session_id: sessionId
    }
  });

  // Hard delete from Firestore
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(planRef);
}

// Permanently delete generated project (hard delete)
export async function permanentlyDeleteGeneratedProject(projectId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const projectRef = doc(db, 'users', user.uid, 'generated_projects', projectId);
  
  // Log permanent deletion
  await logUserActivity({
    action: 'project_permanently_deleted',
    details: {
      project_id: projectId
    }
  });

  // Hard delete from Firestore
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(projectRef);
}

// Save user activity log
export async function logUserActivity(activity: {
  action: string;
  details: any;
}) {
  const user = auth.currentUser;
  if (!user) return;

  const activityId = `activity_${Date.now()}`;
  const activityRef = doc(db, 'users', user.uid, 'activity_logs', activityId);

  await setDoc(activityRef, {
    ...activity,
    user_id: user.uid,
    timestamp: serverTimestamp()
  });
}

// Save user preferences
export async function saveUserPreferences(preferences: {
  preferred_languages?: string[];
  preferred_frameworks?: string[];
  default_project_type?: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', user.uid);
  
  await setDoc(userRef, {
    preferences,
    updated_at: serverTimestamp()
  }, { merge: true });
}

// Get user preferences
export async function getUserPreferences() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data().preferences || null;
}

// Get user statistics
export async function getUserStatistics() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  // Get all projects
  const projectsRef = collection(db, 'users', user.uid, 'generated_projects');
  const projectsQuery = query(projectsRef, where('status', '!=', 'deleted'));
  const projectsSnapshot = await getDocs(projectsQuery);
  const totalProjects = projectsSnapshot.size;

  // Get all plans
  const plansRef = collection(db, 'users', user.uid, 'hackathon_plans');
  const plansQuery = query(plansRef, where('status', '==', 'active'));
  const plansSnapshot = await getDocs(plansQuery);
  const activePlans = plansSnapshot.size;

  // Get total AI generations (projects + plans)
  const aiGenerations = totalProjects + plansSnapshot.size;

  // Get last activity
  const activityRef = collection(db, 'users', user.uid, 'activity_logs');
  const activityQuery = query(activityRef);
  const activitySnapshot = await getDocs(activityQuery);
  
  let lastActivity = 'Never';
  if (!activitySnapshot.empty) {
    const activities = activitySnapshot.docs.map(doc => doc.data());
    const sortedActivities = activities.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });
    
    if (sortedActivities[0]?.timestamp) {
      const lastTime = sortedActivities[0].timestamp.toDate();
      const now = new Date();
      const diffMs = now.getTime() - lastTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) {
        lastActivity = 'Just now';
      } else if (diffMins < 60) {
        lastActivity = `${diffMins}m ago`;
      } else if (diffHours < 24) {
        lastActivity = `${diffHours}h ago`;
      } else if (diffDays < 7) {
        lastActivity = `${diffDays}d ago`;
      } else {
        lastActivity = lastTime.toLocaleDateString();
      }
    }
  }

  return {
    totalProjects,
    activePlans,
    aiGenerations,
    lastActivity
  };
}

// Get recent activity logs
export async function getRecentActivity(limit: number = 10) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const activityRef = collection(db, 'users', user.uid, 'activity_logs');
  const activitySnapshot = await getDocs(activityRef);

  const activities: any[] = [];
  activitySnapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() });
  });

  // Sort by timestamp descending
  const sortedActivities = activities.sort((a, b) => {
    const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
    const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
    return timeB - timeA;
  });

  // Take only the most recent activities
  return sortedActivities.slice(0, limit).map(activity => {
    const timestamp = activity.timestamp?.toDate();
    let timeAgo = 'Unknown';
    
    if (timestamp) {
      const now = new Date();
      const diffMs = now.getTime() - timestamp.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) {
        timeAgo = 'Just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays === 1) {
        timeAgo = 'Yesterday';
      } else if (diffDays < 7) {
        timeAgo = `${diffDays} days ago`;
      } else {
        timeAgo = timestamp.toLocaleDateString();
      }
    }

    // Format action description
    let description = activity.action;
    if (activity.action === 'hackathon_plan_created') {
      description = `Created hackathon plan: ${activity.details?.hackathon_name || 'Untitled'}`;
    } else if (activity.action === 'project_generated') {
      description = `Generated project: ${activity.details?.project_name || 'Untitled'}`;
    } else if (activity.action === 'project_deleted') {
      description = 'Deleted a project';
    } else if (activity.action === 'hackathon_plan_deleted') {
      description = 'Deleted a hackathon plan';
    }

    return {
      ...activity,
      description,
      timeAgo
    };
  });
}
