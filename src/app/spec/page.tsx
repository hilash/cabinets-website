import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionLabel } from "@/components/ui/section-label";
import { CopyButton } from "@/components/ui/copy-button";

function YamlBlock({
  title,
  filename,
  children,
}: {
  title?: string;
  filename: string;
  children: string;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {title && (
        <div className="px-4 py-2.5 bg-bg-warm border-b border-border">
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>
      )}
      <div className="bg-bg-terminal">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-white/30 font-code flex-1">{filename}</span>
          <CopyButton text={children} />
        </div>
        <pre className="px-4 py-3 text-sm text-white/80 font-code leading-relaxed overflow-x-auto whitespace-pre">
          {children}
        </pre>
      </div>
    </div>
  );
}

function FieldTable({
  fields,
}: {
  fields: { name: string; required: boolean; description: string }[];
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bg-warm border-b border-border">
            <th className="text-left px-4 py-2.5 font-code text-xs text-text-tertiary font-normal">
              Field
            </th>
            <th className="text-left px-4 py-2.5 font-code text-xs text-text-tertiary font-normal">
              Required
            </th>
            <th className="text-left px-4 py-2.5 font-code text-xs text-text-tertiary font-normal">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {fields.map((f) => (
            <tr key={f.name} className="bg-bg-card">
              <td className="px-4 py-2.5 font-code text-accent text-xs">
                {f.name}
              </td>
              <td className="px-4 py-2.5 text-xs text-text-tertiary">
                {f.required ? (
                  <span className="text-accent font-medium">yes</span>
                ) : (
                  "no"
                )}
              </td>
              <td className="px-4 py-2.5 text-text-secondary font-body-serif text-xs">
                {f.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SpecPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b border-border bg-bg-warm">
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
            <SectionLabel>Specification</SectionLabel>
            <h1 className="mt-4 font-display text-4xl italic text-text-primary sm:text-5xl">
              Cabinet File Format
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary font-body-serif leading-relaxed">
              A cabinet is a directory on disk. This page documents every file
              that makes up a cabinet &mdash; the identity file, agent personas,
              scheduled jobs, and knowledge base.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-16 space-y-20">
          {/* Overview */}
          <section>
            <SectionLabel>Overview</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Directory structure
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              Every cabinet directory must contain these files. Child cabinets
              are nested subdirectories that also contain a{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .cabinet
              </code>{" "}
              file.
            </p>
            <YamlBlock filename="required structure">
{`my-cabinet/
  .cabinet              # identity & metadata (YAML, no extension)
  .cabinet-state/       # runtime state directory (gitkeep'd)
  .agents/              # AI team members
    ceo/persona.md      #   agent persona (markdown + YAML frontmatter)
    cto/persona.md
  .jobs/                # scheduled automations
    weekly-brief.yaml   #   job definition (YAML)
  index.md              # entry point (markdown + YAML frontmatter)
  company/              # knowledge base (any markdown/CSV files)
  marketing/            # child cabinet (has its own .cabinet file)
    .cabinet
    .agents/
    .jobs/
    index.md`}
            </YamlBlock>
          </section>

          {/* .cabinet file */}
          <section id="cabinet-file">
            <SectionLabel>.cabinet</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Identity file
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              The{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .cabinet
              </code>{" "}
              file is YAML with no file extension. It declares the
              cabinet&apos;s identity, version, and relationship to its parent.
              Every cabinet directory must have one.
            </p>

            <div className="space-y-4">
              <YamlBlock title="Root cabinet" filename=".cabinet">
{`schemaVersion: 1
id: text-your-mom-root
name: Text Your Mom
kind: root
version: 0.1.0
description: Relatable B2C app company cabinet.
entry: index.md`}
              </YamlBlock>

              <YamlBlock title="Child cabinet with parent context" filename="app-development/.cabinet">
{`schemaVersion: 1
id: text-your-mom-app-development
name: App Development
kind: child
version: 0.1.0
description: Product, engineering, QA, and release cabinet.
entry: index.md

parent:
  shared_context:
    - /company/strategy/index.md
    - /company/goals/index.md

access:
  mode: subtree-plus-parent-brief`}
              </YamlBlock>

              <YamlBlock title="Root cabinet with attribution" filename="career-ops/.cabinet">
{`schemaVersion: 1
id: career-ops-root
name: Career Ops
kind: root
version: 0.1.0
description: >
  AI-powered job search command center.
entry: index.md
attribution:
  source: https://github.com/santifer/career-ops
  author: Santiago Fernandez de Valderrama (@santifer)
  license: MIT`}
              </YamlBlock>
            </div>

            <div className="mt-6">
              <h3 className="font-code text-sm font-semibold text-text-primary mb-3">
                Fields
              </h3>
              <FieldTable
                fields={[
                  {
                    name: "schemaVersion",
                    required: true,
                    description: "Schema version number. Currently 1.",
                  },
                  {
                    name: "id",
                    required: true,
                    description:
                      "Unique identifier for this cabinet (kebab-case).",
                  },
                  {
                    name: "name",
                    required: true,
                    description: "Human-readable display name.",
                  },
                  {
                    name: "kind",
                    required: true,
                    description:
                      '"root" for top-level cabinets, "child" for nested ones.',
                  },
                  {
                    name: "version",
                    required: true,
                    description: "Semantic version string.",
                  },
                  {
                    name: "description",
                    required: true,
                    description: "One-line description of the cabinet.",
                  },
                  {
                    name: "entry",
                    required: true,
                    description:
                      "Path to the markdown entry point (usually index.md).",
                  },
                  {
                    name: "parent",
                    required: false,
                    description:
                      "Parent relationship. Contains shared_context (list of files visible from parent).",
                  },
                  {
                    name: "access",
                    required: false,
                    description:
                      "Access control. mode defines visibility scope (e.g. subtree-plus-parent-brief).",
                  },
                  {
                    name: "attribution",
                    required: false,
                    description:
                      "Credit for the original source: source URL, author, license.",
                  },
                ]}
              />
            </div>
          </section>

          {/* Agents */}
          <section id="agents">
            <SectionLabel>.agents/</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Agent personas
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              Each agent lives in its own directory under{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .agents/&lt;slug&gt;/persona.md
              </code>
              . The file uses YAML frontmatter for structured fields and
              markdown body for the agent&apos;s persona and instructions.
            </p>

            <YamlBlock
              title="CEO agent persona"
              filename=".agents/ceo/persona.md"
            >
{`---
name: CEO
slug: ceo
emoji: "\u{1F3AF}"
type: lead
department: leadership
role: Strategic leadership, cross-cabinet coordination
heartbeat: "0 9 * * 1-5"
budget: 100
active: true
focus:
  - strategy
  - prioritization
  - company-rhythm
tags:
  - leadership
  - strategy
---

# CEO Agent

You are the CEO of Text Your Mom.
Your job is to keep the whole company aligned around
one simple truth: we are building the tiny, emotionally
intelligent app that helps people stop neglecting the
people they love.`}
            </YamlBlock>

            <div className="mt-6">
              <h3 className="font-code text-sm font-semibold text-text-primary mb-3">
                Frontmatter fields
              </h3>
              <FieldTable
                fields={[
                  {
                    name: "name",
                    required: true,
                    description: "Display name for the agent.",
                  },
                  {
                    name: "slug",
                    required: true,
                    description:
                      "Directory name and unique identifier (kebab-case).",
                  },
                  {
                    name: "emoji",
                    required: false,
                    description: "Visual identifier emoji.",
                  },
                  {
                    name: "type",
                    required: true,
                    description:
                      '"lead" for team leads, "specialist" for individual contributors.',
                  },
                  {
                    name: "department",
                    required: false,
                    description:
                      "Organizational grouping (e.g. leadership, engineering, marketing).",
                  },
                  {
                    name: "role",
                    required: true,
                    description: "One-line role description.",
                  },
                  {
                    name: "heartbeat",
                    required: false,
                    description:
                      "Cron schedule for periodic check-ins (e.g. \"0 9 * * 1-5\" for weekdays at 9am).",
                  },
                  {
                    name: "budget",
                    required: false,
                    description:
                      "Relative token budget from 0-100. Higher means more context per run.",
                  },
                  {
                    name: "active",
                    required: false,
                    description:
                      "Whether the agent is active. Defaults to true.",
                  },
                  {
                    name: "focus",
                    required: false,
                    description: "List of focus area tags.",
                  },
                  {
                    name: "tags",
                    required: false,
                    description: "Classification tags for filtering.",
                  },
                ]}
              />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-accent-bg-subtle p-5">
              <p className="text-sm text-text-secondary font-body-serif leading-relaxed">
                <strong className="text-text-primary">The markdown body</strong>{" "}
                is the agent&apos;s persona &mdash; its system prompt. Write it
                in second person (&quot;You are the CEO&quot;) and describe what
                the agent should care about, how it should behave, and what
                success looks like.
              </p>
            </div>
          </section>

          {/* Jobs */}
          <section id="jobs">
            <SectionLabel>.jobs/</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Scheduled jobs
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              Jobs are YAML files in the{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .jobs/
              </code>{" "}
              directory. Each job is a scheduled automation owned by an agent
              &mdash; think of them as the meetings and recurring workflows of
              your AI team.
            </p>

            <YamlBlock
              title="Weekly executive brief"
              filename=".jobs/weekly-executive-brief.yaml"
            >
{`id: weekly-executive-brief
name: Weekly Executive Brief
description: >
  Creates the weekly leadership brief covering
  growth, product risks, and next decisions.
ownerAgent: ceo
enabled: true
schedule: "0 9 * * 1"
prompt: |-
  Review the company strategy, goals, KPI pages,
  and all active child cabinet summaries.
  Write a sharp weekly executive brief that includes:
  - what changed this week
  - the biggest growth or retention signal
  - the top product risk
  - one decision leadership should make next`}
            </YamlBlock>

            <div className="mt-6">
              <h3 className="font-code text-sm font-semibold text-text-primary mb-3">
                Fields
              </h3>
              <FieldTable
                fields={[
                  {
                    name: "id",
                    required: true,
                    description: "Unique identifier for the job (kebab-case).",
                  },
                  {
                    name: "name",
                    required: true,
                    description: "Human-readable display name.",
                  },
                  {
                    name: "description",
                    required: false,
                    description: "What the job does.",
                  },
                  {
                    name: "ownerAgent",
                    required: true,
                    description:
                      "Slug of the agent that runs this job. Must match an agent in .agents/.",
                  },
                  {
                    name: "enabled",
                    required: true,
                    description: "Whether the job is active.",
                  },
                  {
                    name: "schedule",
                    required: true,
                    description:
                      'Cron expression (e.g. "0 9 * * 1" for Mondays at 9am).',
                  },
                  {
                    name: "prompt",
                    required: true,
                    description:
                      "The prompt the agent executes when the job fires.",
                  },
                ]}
              />
            </div>
          </section>

          {/* index.md */}
          <section id="index-md">
            <SectionLabel>index.md</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Entry point
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              The entry point markdown file is referenced by the{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                entry
              </code>{" "}
              field in{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .cabinet
              </code>
              . It uses YAML frontmatter for metadata and describes the
              cabinet&apos;s purpose.
            </p>

            <YamlBlock title="Cabinet entry point" filename="index.md">
{`---
title: Text Your Mom
created: '2026-04-11T00:00:00Z'
tags:
  - example
  - b2c
  - company
  - cabinet
order: 1
---

# Text Your Mom

Text Your Mom is a playful consumer app that helps
people stay close to family and friends by nudging
them to reply, check in, and keep tiny relationship
promises.

## Company Modules

- [[company/strategy]]
- [[company/goals]]
- [[marketing]]
- [[app-development]]`}
            </YamlBlock>
          </section>

          {/* .cabinet-state */}
          <section id="cabinet-state">
            <SectionLabel>.cabinet-state/</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Runtime state
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              The{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .cabinet-state/
              </code>{" "}
              directory is reserved for runtime state &mdash; logs, caches,
              ephemeral data generated by agents and jobs. In templates, keep it
              empty with a{" "}
              <code className="font-code text-sm bg-bg-warm px-1.5 py-0.5 rounded">
                .gitkeep
              </code>
              .
            </p>
            <YamlBlock filename=".cabinet-state/">
{`.cabinet-state/
  .gitkeep              # keep the directory in version control
  # runtime files appear here when agents run`}
            </YamlBlock>
          </section>

          {/* Nesting */}
          <section id="nesting">
            <SectionLabel>Nesting</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              Cabinet tree
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-6 max-w-2xl">
              Cabinets nest. A root cabinet can contain child cabinets, which
              can contain their own children. Each child is a self-contained
              operating unit that inherits shared context from its parent.
            </p>

            <YamlBlock
              title="Text Your Mom &mdash; 1 root + 3 children, 16 agents"
              filename="tree"
            >
{`text-your-mom/                    # root cabinet
  .cabinet                         # kind: root
  .agents/ceo, coo, cfo, cto      # 4 root agents
  .jobs/                           # root jobs

  marketing/
    reddit/                        # child cabinet
      .cabinet                     # kind: child
      .agents/growth-marketer, researcher, copywriter, data-analyst

    tiktok/                        # child cabinet
      .cabinet                     # kind: child
      .agents/trend-scout, script-writer, image-creator, post-optimizer

  app-development/                 # child cabinet
    .cabinet                       # kind: child
    .agents/product-manager, cto, qa, devops`}
            </YamlBlock>

            <div className="mt-6 rounded-xl border border-border bg-accent-bg-subtle p-5">
              <p className="text-sm text-text-secondary font-body-serif leading-relaxed">
                <strong className="text-text-primary">
                  Shared context
                </strong>{" "}
                &mdash; child cabinets declare which parent files they can see
                via{" "}
                <code className="font-code text-xs bg-bg-warm px-1 py-0.5 rounded">
                  parent.shared_context
                </code>
                . This lets a marketing team read the company strategy without
                having access to financial data.
              </p>
            </div>
          </section>

          {/* The Transposition */}
          <section id="transposition">
            <SectionLabel>Transposition</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-4">
              From org chart to file tree
            </h2>
            <p className="text-text-secondary font-body-serif leading-relaxed mb-8 max-w-2xl">
              A cabinet maps the three pillars of a human organization onto
              plain files. This is the core insight &mdash; everything a team
              needs is already representable as directories and text.
            </p>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-warm border-b border-border">
                    <th className="text-left px-4 py-3 font-display italic text-text-primary text-base">
                      Human Organization
                    </th>
                    <th className="text-left px-4 py-3 font-display italic text-accent text-base">
                      Cabinet Equivalent
                    </th>
                    <th className="text-left px-4 py-3 font-code text-xs text-text-tertiary font-normal">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-bg-card">
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-text-primary">People</strong>{" "}
                      &mdash; employees, roles
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-accent">Agents</strong> &mdash;
                      personas, heartbeats
                    </td>
                    <td className="px-4 py-3 font-code text-xs text-text-tertiary">
                      .agents/&lt;slug&gt;/persona.md
                    </td>
                  </tr>
                  <tr className="bg-bg-card">
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-text-primary">Meetings</strong>{" "}
                      &mdash; standups, reviews
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-accent">Jobs</strong> &mdash;
                      cron schedules, prompts
                    </td>
                    <td className="px-4 py-3 font-code text-xs text-text-tertiary">
                      .jobs/&lt;name&gt;.yaml
                    </td>
                  </tr>
                  <tr className="bg-bg-card">
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-text-primary">Knowledge</strong>{" "}
                      &mdash; tribal, institutional
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-body-serif">
                      <strong className="text-accent">Files</strong> &mdash;
                      markdown, CSV, data
                    </td>
                    <td className="px-4 py-3 font-code text-xs text-text-tertiary">
                      *.md, *.csv in the tree
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Conventions */}
          <section id="conventions">
            <SectionLabel>Conventions</SectionLabel>
            <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-6">
              Naming &amp; rules
            </h2>

            <div className="space-y-3">
              {[
                {
                  rule: "Directory names use kebab-case",
                  example: "text-your-mom, app-development, career-ops",
                },
                {
                  rule: ".cabinet files are YAML with no file extension",
                  example: ".cabinet (not .cabinet.yaml)",
                },
                {
                  rule: "Agent personas are markdown with YAML frontmatter",
                  example: ".agents/ceo/persona.md",
                },
                {
                  rule: "Jobs are YAML files with .yaml extension",
                  example: ".jobs/weekly-brief.yaml",
                },
                {
                  rule: "Every cabinet must have these files",
                  example:
                    ".cabinet, .agents/, .jobs/, index.md, .cabinet-state/.gitkeep",
                },
                {
                  rule: "Child cabinets are subdirectories with their own .cabinet file",
                  example: "marketing/reddit/.cabinet (kind: child)",
                },
                {
                  rule: ".cabinet-state/ is for runtime only",
                  example: "Keep empty with .gitkeep in templates",
                },
              ].map((item) => (
                <div
                  key={item.rule}
                  className="flex gap-4 rounded-xl border border-border bg-bg-card p-4"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-bg flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.rule}
                    </p>
                    <p className="text-xs font-code text-text-tertiary mt-1">
                      {item.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
