"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Bot, Clock, FolderTree, FileText, Search, ChevronRight } from "lucide-react";
import { TagBadge } from "@/components/ui/tag-badge";
import { StarButton } from "./star-button";
import type { RegistryEntry } from "@/types";

function CabinetListItem({ entry }: { entry: RegistryEntry }) {
  const firstEmoji = entry.agents[0]?.emoji || "";

  return (
    <Link
      href={`/cabinet/${entry.slug}`}
      className="group flex items-center gap-5 rounded-xl border border-border bg-bg-card px-5 py-4 card-hover"
    >
      {firstEmoji && <span className="text-2xl shrink-0">{firstEmoji}</span>}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-sans text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
            {entry.meta.name}
          </h3>
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[9px] font-code text-text-muted">
            v{entry.meta.version}
          </span>
        </div>
        <p className="text-sm text-text-secondary font-sans line-clamp-1">
          {entry.meta.description}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-xs text-text-tertiary shrink-0">
        <span className="flex items-center gap-1">
          <Bot className="h-3.5 w-3.5" />
          {entry.stats.totalAgents}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {entry.stats.totalJobs}
        </span>
        {entry.stats.totalCabinets > 1 && (
          <span className="flex items-center gap-1">
            <FolderTree className="h-3.5 w-3.5" />
            {entry.stats.totalCabinets}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {entry.stats.totalPages}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StarButton slug={entry.slug} size="sm" />
        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
      </div>
    </Link>
  );
}

interface CabinetListProps {
  entries: RegistryEntry[];
  allTags: string[];
}

export function CabinetList({ entries, allTags }: CabinetListProps) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  function handleTagToggle(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const filtered = useMemo(() => {
    let result = entries;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (e) =>
          e.meta.name.toLowerCase().includes(q) ||
          e.meta.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTags.length > 0) {
      result = result.filter((e) =>
        activeTags.some((tag) => e.tags.includes(tag))
      );
    }
    return result;
  }, [entries, query, activeTags]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cabinets..."
          className="w-full rounded-lg border border-border bg-bg-card pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {allTags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTags.includes(tag)}
              onClick={() => handleTagToggle(tag)}
            />
          ))}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.map((entry) => (
          <CabinetListItem key={entry.slug} entry={entry} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-text-tertiary font-body-serif">No cabinets match your search.</p>
        </div>
      )}
    </div>
  );
}
