"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FolderTree,
  FolderOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  Brain,
  Heart,
  Zap,
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

/* ─── The org tree data ─── */
const CEO_NODE = {
  human: { emoji: "👩‍💼", name: "Sarah Chen", role: "CEO" },
  ai: { emoji: "🎯", name: "CEO Agent", path: ".agents/ceo/persona.md", pulse: true },
};

const TEAMS = [
  {
    name: "Marketing",
    aiName: "marketing/",
    people: [
      {
        human: { emoji: "📊", name: "Lena Park", role: "Head of Growth" },
        ai: { emoji: "📈", name: "Growth Agent", path: ".agents/growth/", pulse: true },
      },
      {
        human: { emoji: "✍️", name: "Jake Liu", role: "Content Writer" },
        ai: { emoji: "✍️", name: "Content Agent", path: ".agents/content/" },
      },
    ],
    meetings: [
      {
        human: { icon: "calendar" as const, name: "Weekly standup", sub: "Every Monday" },
        ai: { icon: "clock" as const, name: "Weekly Brief", sub: "0 9 * * 1" },
      },
      {
        human: { icon: "message" as const, name: "Slack check-in", sub: "Ad hoc daily" },
        ai: { icon: "heart" as const, name: "Heartbeat", sub: "every 4h" },
      },
    ],
    knowledge: [
      {
        human: { name: "Lena's Brain", sub: "" },
        ai: { name: "strategy/index.md", sub: ".md file" },
      },
    ],
  },
  {
    name: "Engineering",
    aiName: "engineering/",
    people: [
      {
        human: { emoji: "👨‍💻", name: "Marcus Kim", role: "CTO" },
        ai: { emoji: "🛠", name: "CTO Agent", path: ".agents/cto/", pulse: true },
      },
      {
        human: { emoji: "💻", name: "Priya Sharma", role: "Backend Dev" },
        ai: { emoji: "💻", name: "Backend Agent", path: ".agents/backend/" },
      },
    ],
    meetings: [
      {
        human: { icon: "calendar" as const, name: "Sprint planning", sub: "Bi-weekly" },
        ai: { icon: "clock" as const, name: "Sprint Plan", sub: "0 9 * * 1" },
      },
      {
        human: { icon: "message" as const, name: "Bug triage call", sub: "Daily 10am" },
        ai: { icon: "zap" as const, name: "Bug Triage", sub: "0 10 * * 1-5" },
      },
    ],
    knowledge: [
      {
        human: { name: "Marcus's Brain", sub: "" },
        ai: { name: "roadmap/index.md", sub: ".md file" },
      },
    ],
  },
  {
    name: "Operations",
    aiName: "operations/",
    people: [
      {
        human: { emoji: "⚙️", name: "David Lee", role: "COO" },
        ai: { emoji: "⚙️", name: "COO Agent", path: ".agents/coo/", pulse: true },
      },
      {
        human: { emoji: "💰", name: "Maria Costa", role: "Finance" },
        ai: { emoji: "💰", name: "Finance Agent", path: ".agents/finance/" },
      },
    ],
    meetings: [
      {
        human: { icon: "calendar" as const, name: "Board call", sub: "Monthly" },
        ai: { icon: "clock" as const, name: "Runway Review", sub: "0 10 1 * *" },
      },
      {
        human: { icon: "message" as const, name: "Ops check-in", sub: "Weekly" },
        ai: { icon: "heart" as const, name: "Heartbeat", sub: "every 8h" },
      },
    ],
    knowledge: [
      {
        human: { name: "Maria's Brain", sub: "" },
        ai: { name: "kpis/metrics.csv", sub: ".csv file" },
      },
    ],
  },
];

// Count: 1 CEO + 3 teams + 6 people + 6 meetings + 3 docs = 19
const FLIP_START = 0.2;
const FLIP_END = 0.88;
const TOTAL_NODES = 19;

function shouldFlip(index: number, progress: number): boolean {
  const threshold = FLIP_START + ((FLIP_END - FLIP_START) * index) / (TOTAL_NODES - 1);
  return progress >= threshold;
}

/* ─── Connectors ─── */
function TreeLine({ height = 20, progress }: { height?: number; progress: number }) {
  const isAI = progress > 0.5;
  return (
    <div
      className="mx-auto transition-colors duration-500"
      style={{
        width: 1.5,
        height,
        background: isAI ? "var(--accent)" : "var(--border-dark)",
        opacity: isAI ? 0.5 : 1,
      }}
    />
  );
}

function BranchConnector({ progress }: { progress: number }) {
  const isAI = progress > 0.5;
  return (
    <div className="relative h-5 mx-4">
      <div
        className="absolute top-0 left-[calc(16.67%)] right-[calc(16.67%)] transition-colors duration-500"
        style={{ height: 1.5, background: isAI ? "var(--accent)" : "var(--border-dark)", opacity: isAI ? 0.5 : 1 }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute transition-colors duration-500"
          style={{
            left: `${16.67 + i * 33.33}%`,
            top: 0,
            width: 1.5,
            height: 20,
            background: isAI ? "var(--accent)" : "var(--border-dark)",
            opacity: isAI ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Generic flip card ─── */
function FlipCard({
  frontContent,
  backContent,
  flipped,
  maxW = "max-w-[155px]",
}: {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  flipped: boolean;
  maxW?: string;
}) {
  return (
    <div className={maxW} style={{ perspective: "600px" }}>
      <div
        className="relative transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>{frontContent}</div>
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          {backContent}
        </div>
      </div>
    </div>
  );
}

/* ─── Person / Agent card faces ─── */
function PersonFace({ emoji, name, sub }: { emoji: string; name: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-2.5 py-1.5">
      <span className="text-base shrink-0">{emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text-primary truncate leading-tight">{name}</p>
        <p className="text-[10px] text-text-tertiary truncate leading-tight mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function AgentFace({ emoji, name, sub, pulse }: { emoji: string; name: string; sub: string; pulse?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-bg-card px-2.5 py-1.5" style={{ borderColor: "rgba(139,94,60,0.25)" }}>
      <span className="text-base shrink-0">{emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-text-primary truncate leading-tight">{name}</p>
        <p className="text-[10px] text-text-tertiary truncate leading-tight font-code mt-0.5">{sub}</p>
      </div>
      {pulse && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />}
    </div>
  );
}

/* ─── Meeting / Job card faces ─── */
const MEETING_ICONS = {
  calendar: Calendar,
  message: Calendar,
  clock: Clock,
  heart: Heart,
  zap: Zap,
};

function MeetingFace({ icon, name, sub }: { icon: string; name: string; sub: string }) {
  const Icon = MEETING_ICONS[icon as keyof typeof MEETING_ICONS] || Calendar;
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2 py-1">
      <Icon className="w-3 h-3 text-text-tertiary shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-text-primary truncate leading-tight">{name}</p>
        <p className="text-[9px] text-text-muted truncate leading-tight">{sub}</p>
      </div>
    </div>
  );
}

function JobFace({ icon, name, sub }: { icon: string; name: string; sub: string }) {
  const Icon = MEETING_ICONS[icon as keyof typeof MEETING_ICONS] || Clock;
  return (
    <div className="flex items-center gap-1.5 rounded-lg border bg-bg-card px-2 py-1" style={{ borderColor: "rgba(139,94,60,0.2)" }}>
      <Icon className="w-3 h-3 text-accent shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-text-primary truncate leading-tight">{name}</p>
        <p className="text-[9px] text-accent/60 truncate leading-tight font-code">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Knowledge / File card faces ─── */
function DocFace({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-2 py-1">
      <Brain className="w-3 h-3 text-text-tertiary shrink-0" />
      <span className="text-[11px] font-medium text-text-primary truncate leading-tight">{name}</span>
    </div>
  );
}

function FileFace({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border bg-bg-card px-2 py-1" style={{ borderColor: "rgba(139,94,60,0.2)" }}>
      <FileText className="w-3 h-3 text-accent shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-text-primary truncate leading-tight font-code">{name}</p>
        <p className="text-[9px] text-accent/60 truncate leading-tight">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Team label flip ─── */
function FlipTeamNode({ humanName, aiName, flipped }: { humanName: string; aiName: string; flipped: boolean }) {
  return (
    <FlipCard
      maxW="max-w-[140px] mx-auto"
      flipped={flipped}
      frontContent={
        <div className="flex items-center justify-center gap-1.5 rounded-xl border border-border-dark bg-bg-warm px-2.5 py-1.5">
          <Users className="w-3.5 h-3.5 text-text-secondary shrink-0" />
          <span className="text-[13px] font-semibold text-text-primary">{humanName}</span>
        </div>
      }
      backContent={
        <div className="flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5" style={{ borderColor: "rgba(139,94,60,0.3)", backgroundColor: "var(--accent-bg)" }}>
          <FolderOpen className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="text-[13px] font-semibold text-accent-warm font-code">{aiName}</span>
        </div>
      }
    />
  );
}

/* ─── Section label inside tree ─── */
function TreeSectionLabel({ label, isAI }: { label: string; isAI: boolean }) {
  return (
    <p
      className="text-[10px] font-code uppercase tracking-[0.15em] font-semibold mt-3 mb-1.5 transition-colors duration-500"
      style={{ color: isAI ? "var(--accent)" : "var(--text-tertiary)" }}
    >
      {label}
    </p>
  );
}

/* ─── Animated stat counter ─── */
function StatCounter({
  label,
  humanValue,
  aiValue,
  prefix = "",
  progress,
  format,
  better,
}: {
  label: string;
  humanValue: number;
  aiValue: number;
  prefix?: string;
  progress: number;
  format: "compact" | "number";
  better: "lower" | "higher";
}) {
  // Smooth interpolation with easing
  const t = Math.max(0, Math.min(1, (progress - 0.25) / 0.6));
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const current = Math.round(humanValue + (aiValue - humanValue) * eased);

  const isAI = progress > 0.55;

  function formatValue(v: number): string {
    if (format === "compact") {
      if (v >= 1000) return `${prefix}${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
      return `${prefix}${v}`;
    }
    return `${prefix}${v.toLocaleString()}`;
  }

  const improved = better === "lower" ? current < humanValue : current > humanValue;
  const dramatic = better === "lower"
    ? current < humanValue * 0.5
    : current > humanValue * 2;

  return (
    <div className="text-center">
      <p
        className="font-display text-2xl sm:text-3xl italic tabular-nums transition-colors duration-300"
        style={{
          color: dramatic ? "var(--accent)" : "var(--text-primary)",
        }}
      >
        {formatValue(current)}
      </p>
      <p className="text-[10px] font-code text-text-secondary uppercase tracking-wider mt-0.5">
        {label}
      </p>
      {isAI && (
        <p
          className="text-[10px] font-code mt-0.5 transition-opacity duration-500"
          style={{
            color: "#16a34a",
            opacity: progress > 0.7 ? 1 : 0,
          }}
        >
          {better === "lower"
            ? `↓ ${Math.round((1 - aiValue / humanValue) * 100)}%`
            : `↑ ${Math.round((aiValue / humanValue - 1) * 100)}%`}
        </p>
      )}
    </div>
  );
}

/* ─── Main hero component ─── */
export function TranspositionHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stickyHeight = el.offsetHeight - window.innerHeight;
    if (stickyHeight <= 0) return;
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / stickyHeight));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isAI = progress > 0.55;

  // Assign sequential flip indices
  let nodeIdx = 0;
  const ceoFlipped = shouldFlip(nodeIdx++, progress);
  const teamFlips = TEAMS.map(() => shouldFlip(nodeIdx++, progress));
  const peopleFlips = TEAMS.map((team) =>
    team.people.map(() => shouldFlip(nodeIdx++, progress))
  );
  const meetingFlips = TEAMS.map((team) =>
    team.meetings.map(() => shouldFlip(nodeIdx++, progress))
  );
  const knowledgeFlips = TEAMS.map((team) =>
    team.knowledge.map(() => shouldFlip(nodeIdx++, progress))
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-border"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-25" />

        <div className="relative h-full flex items-center px-6 py-4">
          <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-10">

            {/* ── LEFT: Heading + terminal ── */}
            <div className="flex flex-col justify-center lg:w-[380px] lg:shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-xs text-text-secondary mb-5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Open directory
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display text-text-primary leading-[1.1] tracking-tight">
                Plug-and-play
                <br />
                <em className="text-accent">AI teams</em> for
                <br />
                <em className="text-accent">AI agents.</em>
              </h1>
              <p className="mt-5 max-w-md text-base text-text-secondary font-body-serif leading-relaxed">
                Each cabinet is a complete AI team — agents, jobs, and knowledge.
                Clone a directory. Run a company.
              </p>

              <div className="mt-6 terminal-chrome max-w-[360px]">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <span className="ml-2 text-[10px] text-white/25 font-code">TRY IT NOW</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <code className="text-sm text-white/80 font-code">
                    <span className="text-white/40">$ </span>
                    npx cabinets add &lt;owner/repo&gt;
                  </code>
                  <CopyButton text="npx cabinets add <owner/repo>" />
                </div>
              </div>

            </div>

            {/* ── RIGHT: Stats + title + org tree ── */}
            <div className="flex flex-col items-center lg:flex-1 lg:min-w-0">
              {/* Stats — no container, display font */}
              <div className="flex items-end justify-center gap-6 mb-3">
                <StatCounter label="Monthly cost" humanValue={180000} aiValue={1400} prefix="$" progress={progress} format="compact" better="lower" />
                <StatCounter label="Hrs / week" humanValue={280} aiValue={1176} progress={progress} format="number" better="higher" />
                <StatCounter label="Tasks / week" humanValue={50} aiValue={5000} progress={progress} format="number" better="higher" />
              </div>

              {/* Mode title — much bigger */}
              <div className="flex items-center gap-3 mt-6 mb-8" style={{ perspective: "800px" }}>
                <div
                  className="inline-block transition-transform duration-700 relative"
                  style={{ transformStyle: "preserve-3d", transform: isAI ? "rotateX(180deg)" : "rotateX(0deg)" }}
                >
                  <div className="flex items-center justify-center gap-3" style={{ backfaceVisibility: "hidden" }}>
                    <Users className="w-7 h-7 text-text-secondary" />
                    <span className="font-display text-3xl sm:text-4xl italic text-text-primary">Human Company</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center gap-3" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
                    <FolderTree className="w-7 h-7 text-accent" />
                    <span className="font-display text-3xl sm:text-4xl italic text-accent-warm">AI Company</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-14 h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all duration-100" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <span
                    className="text-[9px] font-code px-1.5 py-0.5 rounded-full transition-all duration-500"
                    style={{
                      color: isAI ? "var(--accent)" : "var(--text-muted)",
                      backgroundColor: isAI ? "var(--accent-bg)" : "transparent",
                      border: isAI ? "1px solid rgba(139,94,60,0.2)" : "1px solid var(--border)",
                    }}
                  >
                    {isAI ? ".cabinet" : `${Math.round(progress * 100)}%`}
                  </span>
                </div>
              </div>

              {/* The org tree */}
              <div className="w-full max-w-[540px] mx-auto">
                {/* CEO */}
                <div className="max-w-[175px] mx-auto">
                  <FlipCard
                    maxW="w-full"
                    flipped={ceoFlipped}
                    frontContent={<PersonFace emoji={CEO_NODE.human.emoji} name={CEO_NODE.human.name} sub={CEO_NODE.human.role} />}
                    backContent={<AgentFace emoji={CEO_NODE.ai.emoji} name={CEO_NODE.ai.name} sub={CEO_NODE.ai.path} pulse={CEO_NODE.ai.pulse} />}
                  />
                </div>

                <TreeLine height={16} progress={progress} />
                <BranchConnector progress={progress} />

                {/* Three team columns */}
                <div className="grid grid-cols-3 gap-2">
                  {TEAMS.map((team, ti) => (
                    <div key={team.name} className="flex flex-col items-center">
                      <FlipTeamNode humanName={team.name} aiName={team.aiName} flipped={teamFlips[ti]} />

                      <TreeLine height={10} progress={progress} />

                      {/* People / Agents */}
                      <TreeSectionLabel label={isAI ? "agents" : "people"} isAI={isAI} />
                      <div className="space-y-1.5 w-full">
                        {team.people.map((person, pi) => (
                          <FlipCard
                            key={pi}
                            flipped={peopleFlips[ti][pi]}
                            frontContent={<PersonFace emoji={person.human.emoji} name={person.human.name} sub={person.human.role} />}
                            backContent={<AgentFace emoji={person.ai.emoji} name={person.ai.name} sub={person.ai.path} pulse={person.ai.pulse} />}
                          />
                        ))}
                      </div>

                      {/* Meetings / Jobs */}
                      <TreeSectionLabel label={isAI ? "jobs" : "meetings"} isAI={isAI} />
                      <div className="space-y-1 w-full">
                        {team.meetings.map((m, mi) => (
                          <FlipCard
                            key={mi}
                            maxW="max-w-[155px]"
                            flipped={meetingFlips[ti][mi]}
                            frontContent={<MeetingFace icon={m.human.icon} name={m.human.name} sub={m.human.sub} />}
                            backContent={<JobFace icon={m.ai.icon} name={m.ai.name} sub={m.ai.sub} />}
                          />
                        ))}
                      </div>

                      {/* Docs / Files */}
                      <TreeSectionLabel label={isAI ? "files" : "knowledge"} isAI={isAI} />
                      <div className="space-y-1 w-full">
                        {team.knowledge.map((d, di) => (
                          <FlipCard
                            key={di}
                            maxW="max-w-[155px]"
                            flipped={knowledgeFlips[ti][di]}
                            frontContent={<DocFace name={d.human.name} sub={d.human.sub} />}
                            backContent={<FileFace name={d.ai.name} sub={d.ai.sub} />}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
