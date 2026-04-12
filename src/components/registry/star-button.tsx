"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { isStarred, toggleStar } from "@/lib/stars";

interface StarButtonProps {
  slug: string;
  size?: "sm" | "md";
}

export function StarButton({ slug, size = "md" }: StarButtonProps) {
  const [starred, setStarred] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStarred(isStarred(slug));
    setMounted(true);
  }, [slug]);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleStar(slug);
    setStarred(newState);
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const padding = size === "sm" ? "p-1" : "p-1.5";

  return (
    <button
      onClick={handleToggle}
      className={`${padding} rounded-md transition-colors ${
        mounted && starred
          ? "text-amber-500 hover:text-amber-600"
          : "text-text-tertiary hover:text-text-secondary"
      }`}
      aria-label={starred ? "Unstar cabinet" : "Star cabinet"}
    >
      <Star
        className={iconSize}
        fill={mounted && starred ? "currentColor" : "none"}
      />
    </button>
  );
}
