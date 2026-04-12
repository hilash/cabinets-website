"use client";

import {
  FolderTree,
  FolderOpen,
  Clock,
  FileText,
  Bot,
} from "lucide-react";
import type { AgentMeta, JobMeta, RegistryEntry } from "@/types";

/* ─── Helpers ─── */
function groupAgentsByDepartment(agents: AgentMeta[]): Record<string, AgentMeta[]> {
  const groups: Record<string, AgentMeta[]> = {};
  for (const agent of agents) {
    const dept = agent.department || "general";
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(agent);
  }
  return groups;
}

function getJobsForAgent(jobs: JobMeta[], slug: string): JobMeta[] {
  return jobs.filter((j) => j.ownerAgent === slug);
}

/* ─── Connectors ─── */
function VLine({ height = 16 }: { height?: number }) {
  return (
    <div
      className="mx-auto"
      style={{
        width: 1.5,
        height,
        background: "var(--accent)",
        opacity: 0.35,
      }}
    />
  );
}

function HBranch({ count }: { count: number }) {
  if (count <= 1) return <VLine height={16} />;

  // Calculate the spread percentage based on column count
  const edgeInset = count <= 2 ? 25 : count <= 3 ? 16.67 : 12.5;
  const spacing = count <= 1 ? 0 : (100 - edgeInset * 2) / (count - 1);

  return (
    <div className="relative h-4 mx-4">
      {/* Horizontal bar */}
      <div
        className="absolute top-0"
        style={{
          left: `${edgeInset}%`,
          right: `${edgeInset}%`,
          height: 1.5,
          background: "var(--accent)",
          opacity: 0.35,
        }}
      />
      {/* Vertical drops */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${edgeInset + i * spacing}%`,
            top: 0,
            width: 1.5,
            height: 16,
            background: "var(--accent)",
            opacity: 0.35,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Node cards ─── */
function RootNode({ name, childCount }: { name: string; childCount: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 mx-auto"
      style={{ borderColor: "rgba(139,94,60,0.3)", backgroundColor: "var(--accent-bg)" }}>
      <FolderTree className="w-5 h-5 text-accent shrink-0" />
      <div>
        <p className="text-base font-bold text-accent-warm">{name}</p>
        {childCount > 0 && (
          <p className="text-[10px] text-accent/60 font-code">{childCount} child cabinet{childCount > 1 ? "s" : ""}</p>
        )}
      </div>
    </div>
  );
}

function DeptNode({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 mx-auto"
      style={{ borderColor: "rgba(139,94,60,0.25)", backgroundColor: "var(--accent-bg-subtle)" }}>
      <FolderOpen className="w-3.5 h-3.5 text-accent shrink-0" />
      <span className="text-xs font-semibold text-accent-warm font-code">{name}</span>
    </div>
  );
}

function AgentNode({ agent }: { agent: AgentMeta }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-bg-card px-2.5 py-1.5 w-full max-w-[170px]"
      style={{ borderColor: "rgba(139,94,60,0.2)" }}>
      <span className="text-base shrink-0">{agent.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-text-primary truncate leading-tight">{agent.name}</p>
        <p className="text-[9px] text-text-tertiary truncate leading-tight font-code mt-0.5">.agents/{agent.slug}/</p>
      </div>
      {agent.active && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse" />}
    </div>
  );
}

function JobNode({ job }: { job: JobMeta }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border bg-bg-card px-2 py-1 w-full max-w-[170px]"
      style={{ borderColor: "rgba(139,94,60,0.15)" }}>
      <Clock className="w-3 h-3 text-accent shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-text-primary truncate leading-tight">{job.name}</p>
        <p className="text-[8px] text-accent/50 truncate leading-tight font-code">{job.schedule}</p>
      </div>
    </div>
  );
}

function ChildCabinetNode({ name, agentCount }: { name: string; agentCount: number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-bg-card px-2.5 py-1.5 w-full max-w-[170px]"
      style={{ borderColor: "rgba(139,94,60,0.2)" }}>
      <FolderTree className="w-3.5 h-3.5 text-accent shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-text-primary truncate leading-tight">{name}</p>
        <p className="text-[9px] text-text-tertiary truncate leading-tight font-code mt-0.5">
          {agentCount} agent{agentCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

/* ─── Section label ─── */
function TreeLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-code uppercase tracking-[0.15em] font-semibold mt-2.5 mb-1 text-accent/60">
      {children}
    </p>
  );
}

/* ─── Main component ─── */
interface CabinetOrgChartProps {
  entry: RegistryEntry;
}

export function CabinetOrgChart({ entry }: CabinetOrgChartProps) {
  const allAgents = [
    ...entry.agents,
    ...entry.children.flatMap((c) => c.agents),
  ];
  const allJobs = [
    ...entry.jobs,
    ...entry.children.flatMap((c) => c.jobs),
  ];

  const departments = groupAgentsByDepartment(allAgents);
  const deptNames = Object.keys(departments);

  // Limit columns to a max of 4 for readability
  const maxCols = Math.min(deptNames.length, 4);
  const gridCols =
    maxCols <= 2 ? "grid-cols-2" :
    maxCols <= 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6 overflow-x-auto">
      <div className="w-full min-w-[400px] max-w-[720px] mx-auto">
        {/* Root */}
        <div className="flex justify-center">
          <RootNode name={entry.meta.name} childCount={entry.children.length} />
        </div>

        <VLine height={20} />
        <HBranch count={maxCols} />

        {/* Department columns */}
        <div className={`grid ${gridCols} gap-3`}>
          {deptNames.slice(0, 4).map((dept) => {
            const agents = departments[dept];
            return (
              <div key={dept} className="flex flex-col items-center">
                <DeptNode name={dept} />
                <VLine height={10} />

                {/* Agents */}
                <TreeLabel>agents</TreeLabel>
                <div className="space-y-1.5 w-full flex flex-col items-center">
                  {agents.map((agent) => {
                    const agentJobs = getJobsForAgent(allJobs, agent.slug);
                    return (
                      <div key={agent.slug} className="w-full flex flex-col items-center">
                        <AgentNode agent={agent} />
                        {agentJobs.length > 0 && (
                          <div className="mt-1 space-y-1 w-full flex flex-col items-center">
                            {agentJobs.map((job) => (
                              <JobNode key={job.id} job={job} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Unassigned jobs for this department (jobs whose owner isn't in this dept) */}
              </div>
            );
          })}
        </div>

        {/* Overflow departments (if more than 4) */}
        {deptNames.length > 4 && (
          <>
            <VLine height={16} />
            <HBranch count={Math.min(deptNames.length - 4, 4)} />
            <div className={`grid ${
              deptNames.length - 4 <= 2 ? "grid-cols-2" :
              deptNames.length - 4 <= 3 ? "grid-cols-3" : "grid-cols-4"
            } gap-3`}>
              {deptNames.slice(4, 8).map((dept) => {
                const agents = departments[dept];
                return (
                  <div key={dept} className="flex flex-col items-center">
                    <DeptNode name={dept} />
                    <VLine height={10} />
                    <TreeLabel>agents</TreeLabel>
                    <div className="space-y-1.5 w-full flex flex-col items-center">
                      {agents.map((agent) => {
                        const agentJobs = getJobsForAgent(allJobs, agent.slug);
                        return (
                          <div key={agent.slug} className="w-full flex flex-col items-center">
                            <AgentNode agent={agent} />
                            {agentJobs.length > 0 && (
                              <div className="mt-1 space-y-1 w-full flex flex-col items-center">
                                {agentJobs.map((job) => (
                                  <JobNode key={job.id} job={job} />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Child cabinets */}
        {entry.children.length > 0 && (
          <>
            <div className="flex justify-center mt-6">
              <TreeLabel>child cabinets</TreeLabel>
            </div>
            <div className="flex justify-center gap-3 flex-wrap mt-1">
              {entry.children.map((child) => (
                <ChildCabinetNode
                  key={child.path}
                  name={child.meta.name}
                  agentCount={child.agents.length}
                />
              ))}
            </div>
          </>
        )}

        {/* Stats footer */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{allAgents.length}</p>
            <p className="text-[9px] font-code text-text-tertiary uppercase tracking-wider">Agents</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{allJobs.length}</p>
            <p className="text-[9px] font-code text-text-tertiary uppercase tracking-wider">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{deptNames.length}</p>
            <p className="text-[9px] font-code text-text-tertiary uppercase tracking-wider">Depts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{entry.stats.totalPages}</p>
            <p className="text-[9px] font-code text-text-tertiary uppercase tracking-wider">Pages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
