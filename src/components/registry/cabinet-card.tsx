import Link from "next/link";
import { Bot, Clock, FolderTree, FileText } from "lucide-react";
import { TagBadge } from "@/components/ui/tag-badge";
import { StarButton } from "./star-button";
import type { RegistryEntry } from "@/types";

interface CabinetCardProps {
  entry: RegistryEntry;
}

export function CabinetCard({ entry }: CabinetCardProps) {
  const firstEmoji = entry.agents[0]?.emoji || "";

  return (
    <Link
      href={`/cabinet/${entry.slug}`}
      className="block bg-bg-card border border-border rounded-xl card-hover p-6"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          {firstEmoji && <span className="text-xl">{firstEmoji}</span>}
          <h3 className="font-display text-lg text-text-primary italic">
            {entry.meta.name}
          </h3>
        </div>
        <StarButton slug={entry.slug} size="sm" />
      </div>

      <p className="text-sm text-text-secondary font-body-serif mb-4 line-clamp-2">
        {entry.meta.description}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {entry.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-text-tertiary">
        <span className="flex items-center gap-1">
          <Bot className="h-3.5 w-3.5" />
          {entry.stats.totalAgents} agents
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {entry.stats.totalJobs} jobs
        </span>
        {entry.stats.totalCabinets > 1 && (
          <span className="flex items-center gap-1">
            <FolderTree className="h-3.5 w-3.5" />
            {entry.stats.totalCabinets} cabinets
          </span>
        )}
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {entry.stats.totalPages} pages
        </span>
      </div>
    </Link>
  );
}
