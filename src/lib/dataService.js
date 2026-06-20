import { supabase } from '@/lib/supabase';
import {
  SAMPLE_PROJECTS,
  SAMPLE_MESSAGES,
  SAMPLE_ANALYTICS,
} from '@/lib/sampleData';

// Supabase gdy skonfigurowany; localStorage tylko bez bazy lub brak tabel

const STORAGE_KEYS = {
  projects: 'wacraft-demo-projects',
  messages: 'wacraft-demo-messages',
  analytics: 'wacraft-demo-analytics',
  seeded: 'wacraft-demo-seeded-v1',
};

let demoMode = null;

export const isSupabaseConfigured = () => Boolean(supabase);

const isTableMissingError = (error) =>
  error?.code === 'PGRST205' ||
  error?.code === 'PGRST204' ||
  error?.message?.includes('Could not find the table');

const shouldFallbackToLocal = () =>
  !isSupabaseConfigured() || demoMode === true;

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const BROKEN_BATHROOM_URLS = [
  'photo-1620626011761-996317b59d44',
  'photo-1604709177226-055f11dbe865',
];

const FIXED_BATHROOM_IMAGES = [
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
];

const patchBrokenProjectImages = () => {
  const projects = readLocal(STORAGE_KEYS.projects);
  if (!projects?.length) return;

  let changed = false;
  const patched = projects.map((project) => {
    const hasBrokenImage = project.images?.some((url) =>
      BROKEN_BATHROOM_URLS.some((broken) => url?.includes(broken))
    );
    const isBathroomProject =
      project.id === 'sample-proj-005' ||
      project.title?.includes('Łazienka z prysznicem walk-in');

    if (hasBrokenImage || (isBathroomProject && !project.images?.length)) {
      changed = true;
      return { ...project, images: FIXED_BATHROOM_IMAGES };
    }
    return project;
  });

  if (changed) {
    writeLocal(STORAGE_KEYS.projects, patched);
  }
};

export const seedDemoStore = () => {
  if (isSupabaseConfigured()) {
    return;
  }

  patchBrokenProjectImages();

  if (localStorage.getItem(STORAGE_KEYS.seeded)) {
    return;
  }

  writeLocal(STORAGE_KEYS.projects, SAMPLE_PROJECTS);
  writeLocal(STORAGE_KEYS.messages, SAMPLE_MESSAGES);
  writeLocal(STORAGE_KEYS.analytics, SAMPLE_ANALYTICS);
  localStorage.setItem(STORAGE_KEYS.seeded, 'true');
};

export const isDemoMode = () => {
  if (demoMode !== null) return demoMode;
  return !isSupabaseConfigured();
};

const enableDemoMode = () => {
  demoMode = true;
  seedDemoStore();
};

const createId = (prefix) =>
  `${prefix}-${crypto.randomUUID?.() ?? Date.now().toString(36)}`;

const trySupabase = async (operation) => {
  if (!supabase) {
    enableDemoMode();
    return { data: null, error: new Error('Supabase not configured'), useDemo: true };
  }

  try {
    const { data, error } = await operation(supabase);
    if (error) {
      if (isTableMissingError(error)) {
        enableDemoMode();
        return { data: null, error, useDemo: true };
      }
      return { data, error, useDemo: false };
    }
    demoMode = false;
    return { data, error: null, useDemo: false };
  } catch (error) {
    if (!isSupabaseConfigured()) {
      enableDemoMode();
      return { data: null, error, useDemo: true };
    }
    return { data: null, error, useDemo: false };
  }
};

const localProjectsResult = () => {
  seedDemoStore();
  return {
    data: readLocal(STORAGE_KEYS.projects) ?? SAMPLE_PROJECTS,
    error: null,
    isDemo: true,
  };
};

const localMessagesResult = () => {
  seedDemoStore();
  return {
    data: readLocal(STORAGE_KEYS.messages) ?? SAMPLE_MESSAGES,
    error: null,
    isDemo: true,
  };
};

const localAnalyticsResult = () => {
  seedDemoStore();
  return {
    data: readLocal(STORAGE_KEYS.analytics) ?? SAMPLE_ANALYTICS,
    error: null,
    isDemo: true,
  };
};

// projekty

export async function getProjects() {
  const result = await trySupabase((client) =>
    client.from('projects').select('*').order('created_at', { ascending: false })
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data ?? [], error: null, isDemo: false };
  }

  if (shouldFallbackToLocal()) {
    return localProjectsResult();
  }

  return { data: [], error: result.error, isDemo: false };
}

export async function createProject(projectData) {
  const result = await trySupabase((client) =>
    client.from('projects').insert([projectData]).select().single()
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data, error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { data: null, error: result.error, isDemo: false };
  }

  const projects = readLocal(STORAGE_KEYS.projects) ?? [...SAMPLE_PROJECTS];
  const newProject = {
    ...projectData,
    id: createId('proj'),
    created_at: projectData.created_at ?? new Date().toISOString(),
    updated_at: projectData.updated_at ?? new Date().toISOString(),
  };
  projects.unshift(newProject);
  writeLocal(STORAGE_KEYS.projects, projects);
  return { data: newProject, error: null, isDemo: true };
}

export async function updateProject(id, projectData) {
  const result = await trySupabase((client) =>
    client.from('projects').update(projectData).eq('id', id).select().single()
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data, error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { data: null, error: result.error, isDemo: false };
  }

  const projects = readLocal(STORAGE_KEYS.projects) ?? [...SAMPLE_PROJECTS];
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return { data: null, error: new Error('Project not found'), isDemo: true };
  }
  projects[index] = { ...projects[index], ...projectData, id };
  writeLocal(STORAGE_KEYS.projects, projects);
  return { data: projects[index], error: null, isDemo: true };
}

export async function deleteProject(id) {
  const result = await trySupabase((client) =>
    client.from('projects').delete().eq('id', id)
  );

  if (!result.useDemo && !result.error) {
    return { error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { error: result.error, isDemo: false };
  }

  const projects = (readLocal(STORAGE_KEYS.projects) ?? []).filter((p) => p.id !== id);
  writeLocal(STORAGE_KEYS.projects, projects);
  return { error: null, isDemo: true };
}

// wiadomosci

export async function getMessages() {
  const result = await trySupabase((client) =>
    client.from('contact_messages').select('*').order('created_at', { ascending: false })
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data ?? [], error: null, isDemo: false };
  }

  if (shouldFallbackToLocal()) {
    return localMessagesResult();
  }

  return { data: [], error: result.error, isDemo: false };
}

export async function insertMessage(messageData) {
  const payload = {
    ...messageData,
    status: messageData.status ?? 'new',
    is_read: messageData.is_read ?? false,
    created_at: messageData.created_at ?? new Date().toISOString(),
  };

  const result = await trySupabase((client) =>
    client.from('contact_messages').insert([payload]).select().single()
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data, error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { data: null, error: result.error, isDemo: false };
  }

  const messages = readLocal(STORAGE_KEYS.messages) ?? [...SAMPLE_MESSAGES];
  const newMessage = { ...payload, id: createId('msg') };
  messages.unshift(newMessage);
  writeLocal(STORAGE_KEYS.messages, messages);
  return { data: newMessage, error: null, isDemo: true };
}

export async function updateMessage(id, updates) {
  const result = await trySupabase((client) =>
    client.from('contact_messages').update(updates).eq('id', id)
  );

  if (!result.useDemo && !result.error) {
    return { error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { error: result.error, isDemo: false };
  }

  const messages = readLocal(STORAGE_KEYS.messages) ?? [...SAMPLE_MESSAGES];
  const index = messages.findIndex((m) => m.id === id);
  if (index !== -1) {
    messages[index] = { ...messages[index], ...updates };
    writeLocal(STORAGE_KEYS.messages, messages);
  }
  return { error: null, isDemo: true };
}

export async function deleteMessage(id) {
  const result = await trySupabase((client) =>
    client.from('contact_messages').delete().eq('id', id)
  );

  if (!result.useDemo && !result.error) {
    return { error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { error: result.error, isDemo: false };
  }

  const messages = (readLocal(STORAGE_KEYS.messages) ?? []).filter((m) => m.id !== id);
  writeLocal(STORAGE_KEYS.messages, messages);
  return { error: null, isDemo: true };
}

export async function getUnreadMessageCount() {
  const { data } = await getMessages();
  return (data ?? []).filter((m) => !m.is_read).length;
}

// analityka

export async function getAnalytics(limit = 5000) {
  const result = await trySupabase((client) =>
    client.from('analytics').select('*').order('visited_at', { ascending: false }).limit(limit)
  );

  if (!result.useDemo && !result.error) {
    return { data: result.data ?? [], error: null, isDemo: false };
  }

  if (shouldFallbackToLocal()) {
    return localAnalyticsResult();
  }

  return { data: [], error: result.error, isDemo: false };
}

export async function trackPageView(analyticsData) {
  const result = await trySupabase((client) =>
    client.from('analytics').insert([analyticsData])
  );

  if (!result.useDemo && !result.error) {
    return { error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { error: result.error, isDemo: false };
  }

  const analytics = readLocal(STORAGE_KEYS.analytics) ?? [...SAMPLE_ANALYTICS];
  analytics.unshift({
    ...analyticsData,
    id: createId('an'),
  });
  writeLocal(STORAGE_KEYS.analytics, analytics.slice(0, 5000));
  return { error: null, isDemo: true };
}

export async function clearAnalytics() {
  const result = await trySupabase((client) =>
    client.from('analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  );

  if (!result.useDemo && !result.error) {
    return { error: null, isDemo: false };
  }

  if (!shouldFallbackToLocal()) {
    return { error: result.error, isDemo: false };
  }

  writeLocal(STORAGE_KEYS.analytics, []);
  return { error: null, isDemo: true };
}

export function resetDemoStore() {
  if (isSupabaseConfigured()) {
    return;
  }
  localStorage.removeItem(STORAGE_KEYS.seeded);
  seedDemoStore();
  demoMode = true;
}

export async function probeDataBackend() {
  if (!isSupabaseConfigured()) {
    return { backend: 'local', message: 'Brak .env.local — dane w localStorage' };
  }

  const result = await trySupabase((client) =>
    client.from('projects').select('id').limit(1)
  );

  if (result.useDemo) {
    return {
      backend: 'local',
      message: 'Tabele nie istnieją — skonfiguruj bazę w Supabase Dashboard',
    };
  }

  if (result.error) {
    return { backend: 'error', message: result.error.message };
  }

  return { backend: 'supabase', message: 'Panel admin korzysta z bazy Supabase' };
}
