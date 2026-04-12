export interface CabinetMeta {
  schemaVersion: number;
  id: string;
  name: string;
  kind: "root" | "child";
  version: string;
  description: string;
  entry: string;
  parent?: {
    shared_context: string[];
  };
  access?: {
    mode: string;
  };
}

export interface AgentMeta {
  name: string;
  slug: string;
  emoji: string;
  type: "lead" | "specialist";
  department: string;
  role: string;
  heartbeat: string;
  budget: number;
  active: boolean;
  focus: string[];
  tags: string[];
  body: string;
}

export interface JobMeta {
  id: string;
  name: string;
  description: string;
  ownerAgent: string;
  enabled: boolean;
  schedule: string;
  prompt: string;
}

export interface ChildCabinet {
  path: string;
  meta: CabinetMeta;
  agents: AgentMeta[];
  jobs: JobMeta[];
  readme: string;
  readmeHtml: string;
}

export interface RegistryEntry {
  slug: string;
  meta: CabinetMeta;
  agents: AgentMeta[];
  jobs: JobMeta[];
  children: ChildCabinet[];
  readme: string;
  readmeHtml: string;
  tags: string[];
  stats: {
    totalAgents: number;
    totalJobs: number;
    totalCabinets: number;
    totalPages: number;
  };
}
