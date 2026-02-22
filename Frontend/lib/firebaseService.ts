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
