import { Clock } from "lucide-react";
import type { JobMeta } from "@/types";

interface JobCardProps {
  job: JobMeta;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <Clock className="h-4 w-4 text-text-tertiary shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-sans font-medium text-sm text-text-primary">
            {job.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              job.enabled
                ? "bg-green-50 text-green-700"
                : "bg-bg-warm text-text-tertiary"
            }`}
          >
            {job.enabled ? "active" : "paused"}
          </span>
        </div>
        <p className="text-xs text-text-secondary font-sans line-clamp-1">
          {job.description}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-[11px] text-text-tertiary shrink-0">
        <span className="font-code">{job.schedule}</span>
        <span className="text-text-muted">|</span>
        <span className="font-code">@{job.ownerAgent}</span>
      </div>
    </div>
  );
}
