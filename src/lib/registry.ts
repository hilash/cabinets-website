import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";
import type {
  CabinetMeta,
  AgentMeta,
  JobMeta,
  ChildCabinet,
  RegistryEntry,
} from "@/types";

const REGISTRY_DIR = path.join(process.cwd(), "registry");

function parseCabinetFile(cabinetPath: string): CabinetMeta | null {
  try {
    const content = fs.readFileSync(cabinetPath, "utf-8");
    return yaml.load(content) as CabinetMeta;
  } catch {
    return null;
  }
}

function parseAgents(agentsDir: string): AgentMeta[] {
  if (!fs.existsSync(agentsDir)) return [];
  const agents: AgentMeta[] = [];

  for (const slug of fs.readdirSync(agentsDir)) {
    const personaPath = path.join(agentsDir, slug, "persona.md");
    if (!fs.existsSync(personaPath)) continue;

    try {
      const raw = fs.readFileSync(personaPath, "utf-8");
      const { data, content } = matter(raw);
      agents.push({
        name: data.name || slug,
        slug: data.slug || slug,
        emoji: data.emoji || "",
        type: data.type || "specialist",
        department: data.department || "",
        role: data.role || "",
        heartbeat: data.heartbeat || "",
        budget: data.budget || 0,
        active: data.active !== false,
        focus: data.focus || [],
        tags: data.tags || [],
        body: content.trim(),
      });
    } catch {
      // skip malformed agent
    }
  }

  return agents;
}

function parseJobs(jobsDir: string): JobMeta[] {
  if (!fs.existsSync(jobsDir)) return [];
  const jobs: JobMeta[] = [];

  for (const file of fs.readdirSync(jobsDir)) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) continue;
    try {
      const raw = fs.readFileSync(path.join(jobsDir, file), "utf-8");
      const data = yaml.load(raw) as JobMeta;
      if (data && data.id) {
        jobs.push(data);
      }
    } catch {
      // skip malformed job
    }
  }

  return jobs;
}

function countMdFiles(dir: string): number {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMdFiles(full);
    } else if (entry.name.endsWith(".md")) {
      count++;
    }
  }

  return count;
}

function findChildCabinets(rootDir: string, exclude: string): string[] {
  const children: string[] = [];

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (full === exclude) continue;
      const cabinetFile = path.join(full, ".cabinet");
      if (fs.existsSync(cabinetFile)) {
        children.push(full);
      } else {
        scan(full);
      }
    }
  }

  scan(rootDir);
  return children;
}

async function parseCabinetDir(
  dir: string
): Promise<{
  meta: CabinetMeta;
  agents: AgentMeta[];
  jobs: JobMeta[];
  readme: string;
  readmeHtml: string;
} | null> {
  const cabinetFile = path.join(dir, ".cabinet");
  const meta = parseCabinetFile(cabinetFile);
  if (!meta) return null;

  const agents = parseAgents(path.join(dir, ".agents"));
  const jobs = parseJobs(path.join(dir, ".jobs"));

  let readme = "";
  let readmeHtml = "";
  const entryPath = path.join(dir, meta.entry || "index.md");
  if (fs.existsSync(entryPath)) {
    const raw = fs.readFileSync(entryPath, "utf-8");
    const { content } = matter(raw);
    readme = content.trim();
    readmeHtml = await renderMarkdown(readme);
  }

  return { meta, agents, jobs, readme, readmeHtml };
}

export async function getEntry(slug: string): Promise<RegistryEntry | null> {
  const dir = path.join(REGISTRY_DIR, slug);
  if (!fs.existsSync(dir)) return null;

  const root = await parseCabinetDir(dir);
  if (!root) return null;

  // Find child cabinets
  const childDirs = findChildCabinets(dir, dir);
  const children: ChildCabinet[] = [];

  for (const childDir of childDirs) {
    const child = await parseCabinetDir(childDir);
    if (!child) continue;
    children.push({
      path: path.relative(dir, childDir),
      ...child,
    });
  }

  // Aggregate tags from index.md frontmatter
  const entryPath = path.join(dir, root.meta.entry || "index.md");
  let tags: string[] = [];
  if (fs.existsSync(entryPath)) {
    const raw = fs.readFileSync(entryPath, "utf-8");
    const { data } = matter(raw);
    tags = data.tags || [];
  }

  // Compute stats
  const totalAgents =
    root.agents.length +
    children.reduce((sum, c) => sum + c.agents.length, 0);
  const totalJobs =
    root.jobs.length + children.reduce((sum, c) => sum + c.jobs.length, 0);
  const totalCabinets = 1 + children.length;
  const totalPages = countMdFiles(dir);

  return {
    slug,
    meta: root.meta,
    agents: root.agents,
    jobs: root.jobs,
    children,
    readme: root.readme,
    readmeHtml: root.readmeHtml,
    tags,
    stats: { totalAgents, totalJobs, totalCabinets, totalPages },
  };
}

export async function getAllEntries(): Promise<RegistryEntry[]> {
  if (!fs.existsSync(REGISTRY_DIR)) return [];

  const dirs = fs.readdirSync(REGISTRY_DIR, { withFileTypes: true });
  const entries: RegistryEntry[] = [];

  for (const d of dirs) {
    if (!d.isDirectory() || d.name.startsWith(".")) continue;
    const cabinetFile = path.join(REGISTRY_DIR, d.name, ".cabinet");
    if (!fs.existsSync(cabinetFile)) continue;

    const entry = await getEntry(d.name);
    if (entry) entries.push(entry);
  }

  // Sort: entries with more content first
  entries.sort((a, b) => b.stats.totalAgents - a.stats.totalAgents);
  return entries;
}

export async function getAllSlugs(): Promise<string[]> {
  if (!fs.existsSync(REGISTRY_DIR)) return [];

  return fs
    .readdirSync(REGISTRY_DIR, { withFileTypes: true })
    .filter((d) => {
      if (!d.isDirectory() || d.name.startsWith(".")) return false;
      return fs.existsSync(path.join(REGISTRY_DIR, d.name, ".cabinet"));
    })
    .map((d) => d.name);
}

export async function getAllTags(): Promise<string[]> {
  const entries = await getAllEntries();
  const tagSet = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
