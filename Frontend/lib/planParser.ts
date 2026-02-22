// Utility to parse plain text hackathon plan into structured data

export interface ParsedPlan {
  projectName: string;
  generatedDate: string;
  confidenceScore: number;
  timeline: Array<{
    hours: string;
    title: string;
    tasks: string[];
  }>;
  teamMembers: Array<{
    name: string;
    role: string;
    responsibilities: string[];
  }>;
  mvpScope: {
    coreFeatures: string[];
    optionalFeatures: string[];
    stretchGoals: string[];
  };
  techStack: {
    frontend: string[];
    backend: string[];
    deployment: string[];
    tools: string[];
  };
  risks: Array<{
    description: string;
    type: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
  kickstartGuide: {
    backendSteps: Array<{ title: string; description: string }>;
    frontendSteps: Array<{ title: string; description: string }>;
  };
  folderStructure: string;
  demoScript: Array<{
    title: string;
    duration: string;
    content: string;
  }>;
  buildData: {
    buildType: string;
    projectName: string;
    coreFeatures: string[];
    techStack: string[];
    primaryLanguage: string;
    projectType: string;
  };
}

export function parsePlan(planText: string, projectName: string, generatedDate: string): ParsedPlan {
  // Extract confidence score
  const scoreMatch = planText.match(/Score:\s*(\d+)\s*out of 100/i);
  const confidenceScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

  // Extract timeline blocks
  const timeline = extractTimeline(planText);

  // Extract team members (if available in plan)
  const teamMembers = extractTeamMembers(planText);

  // Extract MVP scope
  const mvpScope = extractMVPScope(planText);

  // Extract tech stack
  const techStack = extractTechStack(planText);

  // Extract risks
  const risks = extractRisks(planText);

  // Extract kickstart guide
  const kickstartGuide = extractKickstartGuide(planText);

  // Extract folder structure
  const folderStructure = extractFolderStructure(planText);

  // Extract demo script
  const demoScript = extractDemoScript(planText);

  // Extract build initialization data
  const buildData = extractBuildData(planText, projectName);

  return {
    projectName,
    generatedDate,
    confidenceScore,
    timeline,
    teamMembers,
    mvpScope,
    techStack,
    risks,
    kickstartGuide,
    folderStructure,
    demoScript,
    buildData,
  };
}

function extractTimeline(text: string): Array<{ hours: string; title: string; tasks: string[] }> {
  const timeline: Array<{ hours: string; title: string; tasks: string[] }> = [];
  const timelineSection = text.match(/VISUAL TIMELINE BREAKDOWN([\s\S]*?)(?=TEAM ROLE|$)/i);
  
  if (timelineSection) {
    const blocks = timelineSection[1].match(/Hour\s+(\d+-\d+):\s*([^\n]+)([\s\S]*?)(?=Hour\s+\d+-\d+:|$)/gi);
    
    if (blocks) {
      blocks.forEach(block => {
        const match = block.match(/Hour\s+(\d+-\d+):\s*([^\n]+)([\s\S]*)/i);
        if (match) {
          const hours = `Hour ${match[1]}`;
          const title = match[2].trim();
          const tasksText = match[3];
          const tasks = tasksText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-') || line.match(/^\d+\./))
            .map(line => line.replace(/^[-\d.]\s*/, '').trim())
            .filter(task => task.length > 0);
          
          timeline.push({ hours, title, tasks: tasks.length > 0 ? tasks : ['Execute planned tasks'] });
        }
      });
    }
  }

  // Fallback if no timeline found
  if (timeline.length === 0) {
    timeline.push(
      { hours: 'Hour 0-2', title: 'Planning', tasks: ['Define requirements', 'Set up environment'] },
      { hours: 'Hour 2-6', title: 'Development', tasks: ['Build core features'] },
      { hours: 'Hour 6-8', title: 'Testing', tasks: ['Test functionality'] },
      { hours: 'Hour 8-10', title: 'Presentation', tasks: ['Prepare demo'] }
    );
  }

  return timeline;
}

function extractTeamMembers(text: string): Array<{ name: string; role: string; responsibilities: string[] }> {
  const members: Array<{ name: string; role: string; responsibilities: string[] }> = [];
  const teamSection = text.match(/TEAM ROLE ASSIGNMENTS([\s\S]*?)(?=MVP SCOPE|$)/i);
  
  if (teamSection) {
    // Try to extract member blocks
    const memberBlocks = teamSection[1].split(/\n\n+/);
    memberBlocks.forEach(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        const nameMatch = lines[0].match(/^([^:]+):/);
        const roleMatch = lines.find(l => l.toLowerCase().includes('role'));
        
        if (nameMatch || lines.length > 1) {
          const name = nameMatch ? nameMatch[1].trim() : 'Team Member';
          const role = roleMatch ? roleMatch.split(':')[1]?.trim() || 'Developer' : 'Developer';
          const responsibilities = lines
            .filter(l => l.startsWith('-') || l.match(/^\d+\./))
            .map(l => l.replace(/^[-\d.]\s*/, '').trim());
          
          if (responsibilities.length > 0) {
            members.push({ name, role, responsibilities });
          }
        }
      }
    });
  }

  // Fallback
  if (members.length === 0) {
    members.push({
      name: 'Team Lead',
      role: 'Full Stack Developer',
      responsibilities: ['Coordinate development', 'Implement core features', 'Manage timeline']
    });
  }

  return members;
}

function extractMVPScope(text: string) {
  const mvpSection = text.match(/MVP SCOPE([\s\S]*?)(?=TECH STACK|$)/i);
  
  const coreFeatures: string[] = [];
  const optionalFeatures: string[] = [];
  const stretchGoals: string[] = [];

  if (mvpSection) {
    const coreMatch = mvpSection[1].match(/Core Features[^\n]*:([\s\S]*?)(?=Optional Features|$)/i);
    const optionalMatch = mvpSection[1].match(/Optional Features[^\n]*:([\s\S]*?)(?=Stretch Goals|$)/i);
    const stretchMatch = mvpSection[1].match(/Stretch Goals[^\n]*:([\s\S]*?)(?=\n\n|$)/i);

    if (coreMatch) {
      coreMatch[1].split('\n').forEach(line => {
        const cleaned = line.trim().replace(/^[-\d.]\s*/, '');
        if (cleaned) coreFeatures.push(cleaned);
      });
    }

    if (optionalMatch) {
      optionalMatch[1].split('\n').forEach(line => {
        const cleaned = line.trim().replace(/^[-\d.]\s*/, '');
        if (cleaned) optionalFeatures.push(cleaned);
      });
    }

    if (stretchMatch) {
      stretchMatch[1].split('\n').forEach(line => {
        const cleaned = line.trim().replace(/^[-\d.]\s*/, '');
        if (cleaned) stretchGoals.push(cleaned);
      });
    }
  }

  return {
    coreFeatures: coreFeatures.length > 0 ? coreFeatures : ['User authentication', 'Core functionality', 'Basic UI'],
    optionalFeatures: optionalFeatures.length > 0 ? optionalFeatures : ['Advanced features', 'Analytics'],
    stretchGoals: stretchGoals.length > 0 ? stretchGoals : ['AI integration', 'Mobile app']
  };
}

function extractTechStack(text: string) {
  const techSection = text.match(/TECH STACK RECOMMENDATIONS([\s\S]*?)(?=TECHNICAL KICKSTART|$)/i);
  
  const frontend: string[] = [];
  const backend: string[] = [];
  const deployment: string[] = [];
  const tools: string[] = [];

  if (techSection) {
    const frontendMatch = techSection[1].match(/Frontend:([\s\S]*?)(?=Backend:|$)/i);
    const backendMatch = techSection[1].match(/Backend:([\s\S]*?)(?=Deployment:|$)/i);
    const deploymentMatch = techSection[1].match(/Deployment:([\s\S]*?)(?=Development Tools:|$)/i);
    const toolsMatch = techSection[1].match(/Development Tools:([\s\S]*?)(?=\n\n|$)/i);

    [frontendMatch, backendMatch, deploymentMatch, toolsMatch].forEach((match, idx) => {
      if (match) {
        const items = match[1].split('\n')
          .map(line => line.trim().replace(/^[-\d.]\s*/, ''))
          .filter(item => item.length > 0 && !item.match(/^(Framework|Library|Database|Platform)/i));
        
        if (idx === 0) frontend.push(...items);
        else if (idx === 1) backend.push(...items);
        else if (idx === 2) deployment.push(...items);
        else tools.push(...items);
      }
    });
  }

  return {
    frontend: frontend.length > 0 ? frontend : ['React', 'Tailwind CSS'],
    backend: backend.length > 0 ? backend : ['Node.js', 'Express', 'MongoDB'],
    deployment: deployment.length > 0 ? deployment : ['Vercel', 'Railway'],
    tools: tools.length > 0 ? tools : ['Git', 'VS Code', 'Postman']
  };
}

function extractRisks(text: string) {
  const risks: Array<{ description: string; type: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }> = [];
  const riskSection = text.match(/RISK ANALYSIS([\s\S]*?)(?=PLAN OPTIMIZATION|$)/i);

  if (riskSection) {
    const riskBlocks = riskSection[1].split(/Risk:/i).slice(1);
    
    riskBlocks.forEach(block => {
      const descMatch = block.match(/^([^\n]+)/);
      const typeMatch = block.match(/Type:\s*([^\n]+)/i);
      const severityMatch = block.match(/Severity:\s*(High|Medium|Low)/i);
      const mitigationMatch = block.match(/Mitigation Strategy:\s*([^\n]+)/i);

      if (descMatch) {
        risks.push({
          description: descMatch[1].trim(),
          type: typeMatch ? typeMatch[1].trim() : 'Technical',
          severity: (severityMatch ? severityMatch[1] : 'Medium') as 'High' | 'Medium' | 'Low',
          mitigation: mitigationMatch ? mitigationMatch[1].trim() : 'Monitor and adjust as needed'
        });
      }
    });
  }

  if (risks.length === 0) {
    risks.push({
      description: 'Time constraints may impact feature completion',
      type: 'Time',
      severity: 'Medium',
      mitigation: 'Prioritize MVP features and maintain flexible scope'
    });
  }

  return risks;
}

function extractKickstartGuide(text: string) {
  const guideSection = text.match(/TECHNICAL KICKSTART GUIDE([\s\S]*?)(?=SUGGESTED PROJECT|$)/i);
  
  const backendSteps: Array<{ title: string; description: string }> = [];
  const frontendSteps: Array<{ title: string; description: string }> = [];

  if (guideSection) {
    const backendMatch = guideSection[1].match(/Backend Setup Steps:([\s\S]*?)(?=Frontend Setup Steps:|$)/i);
    const frontendMatch = guideSection[1].match(/Frontend Setup Steps:([\s\S]*?)(?=\n\n\n|$)/i);

    if (backendMatch) {
      const steps = backendMatch[1].match(/\d+\.\s*([^\n]+)([\s\S]*?)(?=\d+\.|$)/g);
      if (steps) {
        steps.forEach(step => {
          const match = step.match(/\d+\.\s*([^\n]+)([\s\S]*)/);
          if (match) {
            backendSteps.push({
              title: match[1].trim(),
              description: match[2].trim().substring(0, 100) + '...'
            });
          }
        });
      }
    }

    if (frontendMatch) {
      const steps = frontendMatch[1].match(/\d+\.\s*([^\n]+)([\s\S]*?)(?=\d+\.|$)/g);
      if (steps) {
        steps.forEach(step => {
          const match = step.match(/\d+\.\s*([^\n]+)([\s\S]*)/);
          if (match) {
            frontendSteps.push({
              title: match[1].trim(),
              description: match[2].trim().substring(0, 100) + '...'
            });
          }
        });
      }
    }
  }

  return {
    backendSteps: backendSteps.length > 0 ? backendSteps : [
      { title: 'Environment Setup', description: 'Install required dependencies and tools' },
      { title: 'Create Main Entry File', description: 'Set up server and basic configuration' }
    ],
    frontendSteps: frontendSteps.length > 0 ? frontendSteps : [
      { title: 'Create Project', description: 'Initialize frontend project with framework' },
      { title: 'Install Dependencies', description: 'Add required packages and libraries' }
    ]
  };
}

function extractFolderStructure(text: string): string {
  const structureSection = text.match(/SUGGESTED PROJECT STRUCTURE([\s\S]*?)(?=BUILD INITIALIZATION|$)/i);
  
  if (structureSection) {
    return structureSection[1].trim();
  }

  return `backend/
  app/
    main.py
    routes.py
    services/
  tests/

frontend/
  src/
    components/
    pages/
  public/`;
}

function extractDemoScript(text: string) {
  const scriptSection = text.match(/TWO-MINUTE DEMO SCRIPT([\s\S]*?)$/i);
  
  const sections: Array<{ title: string; duration: string; content: string }> = [];

  if (scriptSection) {
    const sectionMatches = scriptSection[1].match(/([^:]+)\s*\((\d+\s*seconds?)\):([\s\S]*?)(?=\n\n[A-Z]|$)/gi);
    
    if (sectionMatches) {
      sectionMatches.forEach(match => {
        const parsed = match.match(/([^:]+)\s*\((\d+\s*seconds?)\):([\s\S]*)/i);
        if (parsed) {
          sections.push({
            title: parsed[1].trim(),
            duration: parsed[2].trim(),
            content: parsed[3].trim()
          });
        }
      });
    }
  }

  if (sections.length === 0) {
    sections.push(
      { title: 'Opening', duration: '15 seconds', content: 'Introduce the problem and hook the audience' },
      { title: 'Solution', duration: '30 seconds', content: 'Explain how your solution addresses the problem' },
      { title: 'Demo', duration: '60 seconds', content: 'Show key features in action' },
      { title: 'Closing', duration: '15 seconds', content: 'Strong closing statement about impact' }
    );
  }

  return sections;
}

function extractBuildData(text: string, projectName: string) {
  const buildSection = text.match(/BUILD INITIALIZATION DATA([\s\S]*?)(?=EXECUTION CONFIDENCE|$)/i);
  
  let buildType = 'fullstack';
  let coreFeatures: string[] = [];
  let techStack: string[] = [];
  let primaryLanguage = 'javascript';
  let projectType = 'web';

  if (buildSection) {
    const buildTypeMatch = buildSection[1].match(/Build Type:\s*([^\n]+)/i);
    const featuresMatch = buildSection[1].match(/Core Features:([\s\S]*?)(?=Suggested Tech Stack:|$)/i);
    const techMatch = buildSection[1].match(/Suggested Tech Stack:([\s\S]*?)(?=Primary Language:|$)/i);
    const langMatch = buildSection[1].match(/Primary Language:\s*([^\n]+)/i);
    const typeMatch = buildSection[1].match(/Project Type:\s*([^\n]+)/i);

    if (buildTypeMatch) buildType = buildTypeMatch[1].trim().toLowerCase();
    if (langMatch) primaryLanguage = langMatch[1].trim().toLowerCase();
    if (typeMatch) projectType = typeMatch[1].trim().toLowerCase();

    if (featuresMatch) {
      coreFeatures = featuresMatch[1].split('\n')
        .map(line => line.trim().replace(/^[-\d.]\s*/, ''))
        .filter(f => f.length > 0);
    }

    if (techMatch) {
      techStack = techMatch[1].split('\n')
        .map(line => line.trim().replace(/^[-\d.]\s*/, ''))
        .filter(t => t.length > 0);
    }
  }

  return {
    buildType,
    projectName,
    coreFeatures: coreFeatures.length > 0 ? coreFeatures : ['User authentication', 'Core functionality'],
    techStack: techStack.length > 0 ? techStack : ['React', 'Node.js'],
    primaryLanguage,
    projectType
  };
}
