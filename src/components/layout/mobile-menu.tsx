"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function MobileMenu({ stars }: { stars: number | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 border-b border-border bg-bg/95 backdrop-blur-md z-50">
          <div className="flex flex-col px-4 py-4 gap-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              Browse
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              About
            </Link>
            <Link
              href="/spec"
              onClick={() => setOpen(false)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              Spec
            </Link>
            <a
              href={siteConfig.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              <GitHubIcon className="h-4 w-4" />
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span className="text-xs font-medium">{stars ?? 0}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
