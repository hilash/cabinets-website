import { FolderOpen, Bot, Clock, ChevronRight } from "lucide-react";
import type { RegistryEntry, ChildCabinet } from "@/types";

interface CabinetTreeProps {
  entry: RegistryEntry;
}

function TreeNode({
  name,
  agents,
  jobs,
  depth = 0,
  isChild = false,
}: {
  name: string;
  agents: { emoji: string; name: string }[];
  jobs: { name: string }[];
  depth?: number;
  isChild?: boolean;
}) {
  const indent = depth * 20;

  return (
    <div style={{ paddingLeft: indent }}>
      <div className="flex items-center gap-2 py-1.5">
        <FolderOpen className="h-4 w-4 text-accent shrink-0" />
        <span className="text-sm font-medium text-text-primary">{name}</span>
        {isChild && (
          <span className="rounded bg-accent-bg px-1.5 py-0.5 text-[9px] font-medium text-accent">
            child
          </span>
        )}
      </div>

      {agents.map((agent, i) => (
        <div
          key={i}
          className="flex items-center gap-2 py-1"
          style={{ paddingLeft: 20 }}
        >
          <Bot className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <span className="text-xs text-text-secondary">
            {agent.emoji} {agent.name}
          </span>
        </div>
      ))}

      {jobs.map((job, i) => (
        <div
          key={i}
          className="flex items-center gap-2 py-1"
          style={{ paddingLeft: 20 }}
        >
          <Clock className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <span className="text-xs text-text-secondary">{job.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CabinetTree({ entry }: CabinetTreeProps) {
  // Group children by path segments for hierarchy display
  const sortedChildren = [...entry.children].sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  return (
    <div className="rounded-xl border border-border bg-bg-card p-5">
      <TreeNode
        name={entry.meta.name}
        agents={entry.agents.map((a) => ({ emoji: a.emoji, name: a.name }))}
        jobs={entry.jobs.map((j) => ({ name: j.name }))}
      />

      {sortedChildren.map((child) => {
        const segments = child.path.split("/");
        const depth = segments.length;

        return (
          <div key={child.path} className="mt-1">
            <div
              className="flex items-center gap-1 py-0.5 text-text-muted"
              style={{ paddingLeft: (depth - 1) * 20 }}
            >
              <ChevronRight className="h-3 w-3" />
            </div>
            <TreeNode
              name={child.meta.name}
              agents={child.agents.map((a) => ({
                emoji: a.emoji,
                name: a.name,
              }))}
              jobs={child.jobs.map((j) => ({ name: j.name }))}
              depth={depth}
              isChild
            />
          </div>
        );
      })}
    </div>
  );
}
