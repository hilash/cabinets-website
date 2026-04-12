"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface TerminalBlockProps {
  command: string;
  label?: string;
}

export function TerminalBlock({ command, label }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="terminal-chrome">
      {label && (
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-white/30 font-code">{label}</span>
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-sm text-white/80 font-code">
          <span className="text-white/40">$ </span>
          {command}
        </code>
        <button
          onClick={handleCopy}
          className="ml-4 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
