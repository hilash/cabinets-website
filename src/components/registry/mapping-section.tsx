"use client";

import { useRef, useState, useEffect } from "react";
import {
  Bot,
  FolderOpen,
  Clock,
  FileText,
  Users,
  MessageSquare,
  Brain,
  Zap,
  Heart,
  Play,
} from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

/* ─── Drawer that opens on scroll ─── */
function CabinetDrawer({
  humanLabel,
  humanIcon: HumanIcon,
  humanItems,
  aiLabel,
  aiIcon: AiIcon,
  aiItems,
  index,
}: {
  humanLabel: string;
  humanIcon: React.ElementType;
  humanItems: { icon: React.ElementType; label: string; sub?: string }[];
  aiLabel: string;
  aiIcon: React.ElementType;
  aiItems: { icon: React.ElementType; label: string; sub?: string; pulse?: boolean }[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // Stagger based on index
          setTimeout(() => setOpen(true), index * 400);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="w-full max-w-md mx-auto">
      {/* ── The drawer handle (always visible) ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full group"
      >
        <div
          className="relative flex items-center justify-between rounded-t-xl border border-b-0 px-3 sm:px-5 py-3 sm:py-3.5 transition-all duration-500 cursor-pointer"
          style={{
            borderColor: open ? "rgba(139,94,60,0.3)" : "var(--border-dark)",
            backgroundColor: open ? "var(--accent-bg)" : "var(--bg-warm)",
          }}
        >
          {/* Handle grip lines */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-5 h-[2px] rounded-full bg-border-dark/40" />
          </div>

          {/* Before label */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 transition-opacity duration-500"
            style={{ opacity: open ? 0.4 : 1 }}
          >
            <HumanIcon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
            <span className="font-display text-base sm:text-lg italic text-text-primary">
              {humanLabel}
            </span>
          </div>

          {/* Arrow / transition indicator */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 transition-all duration-500"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            <AiIcon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <span className="font-display text-base sm:text-lg italic text-accent-warm">
              {aiLabel}
            </span>
          </div>
        </div>
      </button>

      {/* ── The drawer body (slides open) ── */}
      <div
        className="overflow-hidden transition-all duration-700 ease-out rounded-b-xl border border-t-0"
        style={{
          maxHeight: open ? "300px" : "0px",
          opacity: open ? 1 : 0,
          borderColor: open ? "rgba(139,94,60,0.3)" : "var(--border-dark)",
        }}
      >
        <div className="px-3 sm:px-5 py-4 bg-bg-card">
          {/* Two columns: was → now */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* Was */}
            <div className="min-w-0">
              <p className="text-[9px] font-code uppercase tracking-[0.15em] text-text-tertiary mb-2 line-through decoration-text-tertiary/40">
                was
              </p>
              <div className="space-y-1.5">
                {humanItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-border bg-bg px-2 py-1.5 transition-all duration-500"
                    style={{
                      transitionDelay: `${i * 80 + 200}ms`,
                      transform: open ? "translateX(0)" : "translateX(-12px)",
                      opacity: open ? 0.8 : 0,
                    }}
                  >
                    <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-secondary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-[11px] text-text-primary truncate">{item.label}</p>
                      {item.sub && <p className="text-[8px] sm:text-[9px] text-text-secondary truncate">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Now */}
            <div className="min-w-0">
              <p className="text-[9px] font-code uppercase tracking-[0.15em] text-accent font-semibold mb-2">
                now
              </p>
              <div className="space-y-1.5">
                {aiItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-lg border bg-bg-card px-2 py-1.5 transition-all duration-500"
                    style={{
                      borderColor: "rgba(139,94,60,0.2)",
                      transitionDelay: `${i * 80 + 300}ms`,
                      transform: open ? "translateX(0)" : "translateX(12px)",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-[11px] font-medium text-text-primary truncate">{item.label}</p>
                      {item.sub && <p className="text-[8px] sm:text-[9px] text-accent/50 truncate font-code">{item.sub}</p>}
                    </div>
                    {item.pulse && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── The mapping section ─── */
export function MappingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 border-b border-border bg-bg-warm">
      <div className="mx-auto max-w-2xl px-6">
        {/* Title */}
        <div
          className="text-center mb-14 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h2 className="font-display text-3xl sm:text-4xl italic text-text-primary mb-3">
            Open the drawers.
          </h2>
          <p className="text-base text-text-secondary font-body-serif leading-relaxed">
            A team used to be people, meetings, and knowledge.<br />
            Now each one fits in a cabinet.
          </p>
        </div>

        {/* The filing cabinet */}
        <div className="space-y-3">
          <CabinetDrawer
            index={0}
            humanLabel="People"
            humanIcon={Users}
            humanItems={[
              { icon: Users, label: "Sarah Chen", sub: "CEO" },
              { icon: Users, label: "Marcus Kim", sub: "CTO" },
              { icon: Users, label: "Lena Park", sub: "Growth" },
            ]}
            aiLabel="Agents"
            aiIcon={Bot}
            aiItems={[
              { icon: Bot, label: "CEO Agent", sub: ".agents/ceo/", pulse: true },
              { icon: Bot, label: "CTO Agent", sub: ".agents/cto/", pulse: true },
              { icon: Bot, label: "Growth Agent", sub: ".agents/growth/" },
            ]}
          />

          <CabinetDrawer
            index={1}
            humanLabel="Meetings"
            humanIcon={MessageSquare}
            humanItems={[
              { icon: MessageSquare, label: "Weekly standup", sub: "Every Monday" },
              { icon: MessageSquare, label: "Sprint planning", sub: "Bi-weekly" },
              { icon: MessageSquare, label: "Slack check-ins", sub: "Ad hoc" },
            ]}
            aiLabel="Jobs"
            aiIcon={Clock}
            aiItems={[
              { icon: Clock, label: "Weekly Brief", sub: "0 9 * * 1", pulse: true },
              { icon: Zap, label: "Sprint Plan", sub: "0 9 * * 1" },
              { icon: Heart, label: "Heartbeat", sub: "every 4h" },
            ]}
          />

          <CabinetDrawer
            index={2}
            humanLabel="Knowledge"
            humanIcon={Brain}
            humanItems={[
              { icon: Brain, label: "Lena's brain" },
              { icon: Brain, label: "Marcus's brain" },
              { icon: Brain, label: "Maria's brain" },
            ]}
            aiLabel="Files"
            aiIcon={FileText}
            aiItems={[
              { icon: FileText, label: "strategy/index.md", sub: ".md" },
              { icon: FileText, label: "roadmap/index.md", sub: ".md" },
              { icon: FileText, label: "kpis/metrics.csv", sub: ".csv" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Cabinet definition section ─── */
export function CabinetDefinitionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="section-label mb-3">Definition</p>
          <h2 className="font-display text-3xl sm:text-4xl italic text-text-primary mb-4">
            What is a Cabinet?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary font-body-serif leading-relaxed">
            A cabinet is an AI team — a self-contained operating unit composed
            of agents, jobs, and data. Everything lives on disk as plain files.
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Agents */}
          <div
            className="rounded-2xl border border-border bg-bg-card p-6 h-full transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "100ms",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent-bg flex items-center justify-center mb-5">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl italic text-text-primary mb-2">Agents</h3>
            <p className="text-sm text-text-secondary font-body-serif leading-relaxed mb-5">
              Persistent AI team members. Each has a persona, role, heartbeat
              schedule, and focus areas.
            </p>
            <div className="space-y-2">
              {[
                { emoji: "🎯", name: "CEO Agent", type: "lead", active: true },
                { emoji: "📈", name: "Growth Agent", type: "specialist", active: true },
                { emoji: "✍️", name: "Content Agent", type: "specialist", active: false },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2">
                  <span className="text-sm">{agent.emoji}</span>
                  <span className="text-xs font-medium text-text-primary flex-1 truncate">{agent.name}</span>
                  <span className={`text-[9px] font-code px-1.5 py-0.5 rounded-full ${agent.type === "lead" ? "bg-accent-bg text-accent" : "bg-bg-warm text-text-tertiary"}`}>{agent.type}</span>
                  {agent.active && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-bg-terminal p-3 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={'# .agents/ceo/persona.md\nname: CEO\ntype: lead\nheartbeat: "0 9 * * 1-5"\nbudget: 100'} />
              </div>
              <pre className="text-[10px] text-white/60 font-code leading-relaxed">
                <span className="text-white/30"># .agents/ceo/persona.md</span>{"\n"}
                <span className="text-amber-300/80">name</span>: CEO{"\n"}
                <span className="text-amber-300/80">type</span>: lead{"\n"}
                <span className="text-amber-300/80">heartbeat</span>: <span className="text-green-300/70">&quot;0 9 * * 1-5&quot;</span>{"\n"}
                <span className="text-amber-300/80">budget</span>: 100
              </pre>
            </div>
          </div>

          {/* Jobs */}
          <div
            className="rounded-2xl border border-border bg-bg-card p-6 h-full transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "250ms",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent-bg flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl italic text-text-primary mb-2">Jobs</h3>
            <p className="text-sm text-text-secondary font-body-serif leading-relaxed mb-5">
              Scheduled automations — cron jobs, heartbeats, and manual tasks.
              Each owned by an agent.
            </p>
            <div className="space-y-0">
              {[
                { name: "Weekly Brief", schedule: "Mon 9am", running: true },
                { name: "Funnel Check", schedule: "Daily 10am", running: true },
                { name: "Runway Review", schedule: "1st/month", running: false },
              ].map((job, i) => (
                <div key={job.name} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${job.running ? "border-accent bg-accent-bg" : "border-border bg-bg"}`} />
                    {i < 2 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-text-primary">{job.name}</span>
                      {job.running && <span className="text-[8px] font-code text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">running</span>}
                    </div>
                    <span className="text-[10px] font-code text-text-tertiary">{job.schedule}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-lg bg-bg-terminal p-3 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={'# .jobs/weekly-brief.yaml\nschedule: "0 9 * * 1"\nownerAgent: ceo\nenabled: true'} />
              </div>
              <pre className="text-[10px] text-white/60 font-code leading-relaxed">
                <span className="text-white/30"># .jobs/weekly-brief.yaml</span>{"\n"}
                <span className="text-amber-300/80">schedule</span>: <span className="text-green-300/70">&quot;0 9 * * 1&quot;</span>{"\n"}
                <span className="text-amber-300/80">ownerAgent</span>: ceo{"\n"}
                <span className="text-amber-300/80">enabled</span>: <span className="text-green-300/70">true</span>
              </pre>
            </div>
          </div>

          {/* Data */}
          <div
            className="rounded-2xl border border-border bg-bg-card p-6 h-full transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "400ms",
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent-bg flex items-center justify-center mb-5">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-xl italic text-text-primary mb-2">Data</h3>
            <p className="text-sm text-text-secondary font-body-serif leading-relaxed mb-5">
              Knowledge base on disk — markdown files, CSVs, templates. Visible,
              inspectable, version-controlled.
            </p>
            <div className="space-y-0.5">
              {[
                { name: "company/", type: "folder", depth: 0 },
                { name: "strategy/", type: "folder", depth: 1 },
                { name: "index.md", type: "file", depth: 2, active: true },
                { name: "goals/", type: "folder", depth: 1 },
                { name: "index.md", type: "file", depth: 2 },
                { name: "kpis/", type: "folder", depth: 1 },
                { name: "index.md", type: "file", depth: 2 },
                { name: "metrics.csv", type: "csv", depth: 2 },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-1.5 py-0.5" style={{ paddingLeft: node.depth * 14 }}>
                  {node.type === "folder" ? (
                    <FolderOpen className="w-3 h-3 text-text-tertiary shrink-0" />
                  ) : (
                    <FileText className={`w-3 h-3 shrink-0 ${node.active ? "text-accent" : "text-text-muted"}`} />
                  )}
                  <span className={`text-[11px] font-code ${node.type === "folder" ? "text-text-primary font-medium" : node.active ? "text-accent" : "text-text-secondary"}`}>{node.name}</span>
                  {node.active && <span className="text-[8px] text-accent bg-accent-bg px-1 py-0.5 rounded ml-auto">entry</span>}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-bg-terminal p-3 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={"# company/strategy/index.md\n---\ntitle: Company Strategy\ntags: [strategy, q2]\n---"} />
              </div>
              <pre className="text-[10px] text-white/60 font-code leading-relaxed">
                <span className="text-white/30"># company/strategy/index.md</span>{"\n"}
                <span className="text-amber-300/80">---</span>{"\n"}
                <span className="text-amber-300/80">title</span>: Company Strategy{"\n"}
                <span className="text-amber-300/80">tags</span>: [strategy, q2]{"\n"}
                <span className="text-amber-300/80">---</span>
              </pre>
            </div>
          </div>
        </div>

        <div
          className="mt-12 text-center transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "600ms",
          }}
        >
          <p className="text-sm text-text-tertiary font-body-serif">
            A cabinet is just a directory. Copy it, version it, share it — it works anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}
