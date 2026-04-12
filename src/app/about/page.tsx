import {
  FolderOpen,
  Bot,
  Clock,
  FileText,
  Eye,
  HardDrive,
  Copy,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalBlock } from "@/components/ui/terminal-block";
import { CopyButton } from "@/components/ui/copy-button";
import { siteConfig } from "@/lib/site-config";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-border bg-bg-warm">
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
            <SectionLabel>About</SectionLabel>
            <h1 className="mt-4 font-display text-4xl italic text-text-primary sm:text-5xl">
              What are Cabinets?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary font-body-serif leading-relaxed">
              A cabinet is a portable, file-system native operating unit for
              AI-powered business functions. It is a directory on disk that
              contains everything a team needs to operate.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-20">
          {/* Mental Model */}
          <section>
            <SectionLabel>The Mental Model</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              A company is a tree of cabinets
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-8 max-w-2xl">
              Just as a real company is a tree of teams — each with its own
              people, knowledge, and workflows — an AI company is a tree of
              cabinets. The root cabinet is your company. Child cabinets are
              departments, projects, or functions.
            </p>

            {/* Visual tree */}
            <div className="rounded-xl border border-border bg-bg-card p-6">
              <div className="font-code text-sm space-y-1 text-text-secondary">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-accent" />
                  <span className="text-text-primary font-medium">my-company/</span>
                  <span className="text-[10px] text-accent bg-accent-bg px-1.5 py-0.5 rounded">root cabinet</span>
                </div>
                {[
                  { indent: 1, icon: FileText, name: ".cabinet", note: "identity" },
                  { indent: 1, icon: Bot, name: ".agents/", note: "AI team members" },
                  { indent: 1, icon: Clock, name: ".jobs/", note: "scheduled work" },
                  { indent: 1, icon: FileText, name: "index.md", note: "entry point" },
                  { indent: 1, icon: FolderOpen, name: "company/", note: "shared knowledge" },
                  { indent: 1, icon: FolderOpen, name: "marketing/", note: "" },
                  { indent: 2, icon: FolderOpen, name: "reddit/", note: "child cabinet" },
                  { indent: 2, icon: FolderOpen, name: "tiktok/", note: "child cabinet" },
                  { indent: 1, icon: FolderOpen, name: "app-development/", note: "child cabinet" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2"
                    style={{ paddingLeft: item.indent * 20 }}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${item.note?.includes("cabinet") ? "text-accent" : "text-text-tertiary"}`} />
                    <span className={item.note?.includes("cabinet") ? "text-text-primary" : ""}>{item.name}</span>
                    {item.note && (
                      <span className="text-[10px] text-text-muted">— {item.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What's Inside */}
          <section>
            <SectionLabel>Anatomy</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-6">
              What&apos;s inside a cabinet
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: FileText,
                  title: ".cabinet",
                  desc: "YAML identity file — name, version, description, and parent relationships.",
                  code: "schemaVersion: 1\nid: marketing\nname: Marketing\nkind: child",
                },
                {
                  icon: Bot,
                  title: ".agents/",
                  desc: "AI team members. Each agent has a persona, heartbeat schedule, budget, and focus areas.",
                  code: "name: CEO\nemoji: \"🎯\"\ntype: lead\nheartbeat: \"0 9 * * 1-5\"",
                },
                {
                  icon: Clock,
                  title: ".jobs/",
                  desc: "Scheduled automations. Cron expressions, owner agent, and prompt templates.",
                  code: "schedule: \"0 9 * * 1\"\nownerAgent: ceo\nenabled: true",
                },
                {
                  icon: FileText,
                  title: "index.md",
                  desc: "Entry point describing the cabinet's purpose, with YAML frontmatter for tags and metadata.",
                  code: "---\ntitle: Marketing\ntags: [marketing, growth]\n---",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-bg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="font-code text-sm font-semibold text-text-primary">{item.title}</h3>
                  </div>
                  <p className="text-sm text-text-secondary font-body-serif leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <div className="rounded-lg bg-bg-terminal p-3 relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton text={item.code} />
                    </div>
                    <pre className="text-[11px] text-white/70 font-code leading-relaxed whitespace-pre-wrap">
                      {item.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Philosophy */}
          <section>
            <SectionLabel>Philosophy</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-6">
              Core principles
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: HardDrive,
                  title: "Local-first",
                  desc: "Files on disk, no database required. Your data stays where you put it.",
                },
                {
                  icon: Copy,
                  title: "Portable",
                  desc: "Copy, move, or version control any cabinet. It is just a directory.",
                },
                {
                  icon: Eye,
                  title: "Inspectable",
                  desc: "Everything is readable in a text editor. No opaque formats, no lock-in.",
                },
                {
                  icon: Layers,
                  title: "Composable",
                  desc: "Nest cabinets to model any org structure. A child cabinet is just a subdirectory with its own .cabinet file.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-bg-card p-5">
                  <div className="w-10 h-10 rounded-lg bg-accent-bg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-base italic text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary font-body-serif leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Install */}
          <section>
            <SectionLabel>Get Started</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Install a cabinet
            </h2>
            <p className="text-text-secondary font-body-serif mb-6">
              Clone the registry and copy any cabinet into your project.
            </p>
            <TerminalBlock
              command={`git clone ${siteConfig.githubRepo}.git && cp -r cabinets/text-your-mom ./my-company`}
              label="Terminal"
            />
          </section>

          {/* Contribute */}
          <section>
            <SectionLabel>Contribute</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Add a cabinet to the registry
            </h2>

            <div className="rounded-xl border border-border bg-bg-card p-6">
              <ol className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Fork the repo",
                    desc: "Fork the cabinets repo on GitHub.",
                  },
                  {
                    step: "2",
                    title: "Create your directory",
                    desc: "Add a new top-level directory with your cabinet name in kebab-case.",
                  },
                  {
                    step: "3",
                    title: "Add the required files",
                    desc: "Include .cabinet, .agents/, .jobs/, and index.md.",
                  },
                  {
                    step: "4",
                    title: "Submit a pull request",
                    desc: "Open a PR and your cabinet will appear in the registry.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent-bg flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-accent">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-text-primary">{item.title}</h4>
                      <p className="text-sm text-text-secondary font-body-serif mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 text-sm text-text-tertiary font-body-serif">
              Learn more about Cabinet at{" "}
              <a
                href={siteConfig.cabinetSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-accent-warm"
              >
                runcabinet.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
