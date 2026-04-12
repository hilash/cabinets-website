"use client";

import { Search } from "lucide-react";
import { TagBadge } from "@/components/ui/tag-badge";

interface SearchFilterProps {
  query: string;
  onQueryChange: (q: string) => void;
  tags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
}

export function SearchFilter({
  query,
  onQueryChange,
  tags,
  activeTags,
  onTagToggle,
}: SearchFilterProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search cabinets..."
          className="w-full rounded-lg border border-border bg-bg-card pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
        />
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTags.includes(tag)}
              onClick={() => onTagToggle(tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
