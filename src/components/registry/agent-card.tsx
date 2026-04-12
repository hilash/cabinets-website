import type { AgentMeta } from "@/types";

interface AgentCardProps {
  agent: AgentMeta;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-card p-4 card-hover">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{agent.emoji}</span>
        <span className="font-medium text-sm text-text-primary">
          {agent.name}
        </span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium ${
            agent.type === "lead"
              ? "bg-accent-bg text-accent"
              : "bg-bg-warm text-text-tertiary"
          }`}
        >
          {agent.type}
        </span>
      </div>
      <p className="text-xs text-text-secondary line-clamp-2 font-sans">
        {agent.role}
      </p>
      {agent.heartbeat && (
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
          <span className="text-[10px] text-text-tertiary font-code">
            {agent.heartbeat}
          </span>
        </div>
      )}
    </div>
  );
}
