"use client";

import { useState, useMemo } from "react";
import { CabinetCard } from "./cabinet-card";
import { SearchFilter } from "./search-filter";
import type { RegistryEntry } from "@/types";

interface CabinetGridProps {
  entries: RegistryEntry[];
  allTags: string[];
}

export function CabinetGrid({ entries, allTags }: CabinetGridProps) {
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
      <SearchFilter
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <CabinetCard key={entry.slug} entry={entry} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-text-tertiary font-body-serif">
            No cabinets match your search.
          </p>
        </div>
      )}
    </div>
  );
}
