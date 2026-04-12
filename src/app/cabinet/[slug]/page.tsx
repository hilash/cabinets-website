import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Clock, FolderTree, FileText } from "lucide-react";
import { getAllSlugs, getEntry } from "@/lib/registry";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SectionLabel } from "@/components/ui/section-label";
import { TagBadge } from "@/components/ui/tag-badge";
import { StarButton } from "@/components/registry/star-button";
import { CabinetTree } from "@/components/registry/cabinet-tree";
import { AgentCard } from "@/components/registry/agent-card";
import { JobCard } from "@/components/registry/job-card";
import { InstallCommand } from "@/components/registry/install-command";
import { CabinetReadme } from "@/components/registry/cabinet-readme";
import { CabinetOrgChart } from "@/components/registry/cabinet-org-chart";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CabinetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getEntry(slug);

  if (!entry) notFound();

  // Collect all agents across root + children, with source path for unique keys
  const allAgents = [
    ...entry.agents.map((a, i) => ({ agent: a, key: `root-${a.slug}-${i}` })),
    ...entry.children.flatMap((c) =>
      c.agents.map((a, i) => ({ agent: a, key: `${c.path}-${a.slug}-${i}` }))
    ),
  ];
  const allJobs = [
    ...entry.jobs,
    ...entry.children.flatMap((c) => c.jobs),
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-bg-warm">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to registry
            </Link>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                  <h1 className="font-sans text-2xl font-bold text-text-primary sm:text-4xl">
                    {entry.meta.name}
                  </h1>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-code text-text-tertiary">
                    v{entry.meta.version}
                  </span>
                </div>
                <p className="text-text-secondary font-sans text-lg max-w-2xl">
                  {entry.meta.description}
                </p>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {entry.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
              <StarButton slug={entry.slug} />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6 text-sm text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                {entry.stats.totalAgents} agents
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {entry.stats.totalJobs} jobs
              </span>
              <span className="flex items-center gap-1.5">
                <FolderTree className="h-4 w-4" />
                {entry.stats.totalCabinets} cabinets
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {entry.stats.totalPages} pages
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">
          {/* Org Chart */}
          <section>
            <SectionLabel>Organization</SectionLabel>
            <div className="mt-4">
              <CabinetOrgChart entry={entry} />
            </div>
          </section>

          {/* Tree */}
          <section>
            <SectionLabel>Cabinet Structure</SectionLabel>
            <div className="mt-4">
              <CabinetTree entry={entry} />
            </div>
          </section>

          {/* Agents */}
          {allAgents.length > 0 && (
            <section>
              <SectionLabel>Agents</SectionLabel>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allAgents.map(({ agent, key }) => (
                  <AgentCard key={key} agent={agent} />
                ))}
              </div>
            </section>
          )}

          {/* Jobs */}
          {allJobs.length > 0 && (
            <section>
              <SectionLabel>Scheduled Jobs</SectionLabel>
              <div className="mt-4 rounded-xl border border-border bg-bg-card divide-y divide-border">
                {allJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* README */}
          {entry.readmeHtml && (
            <section>
              <SectionLabel>About</SectionLabel>
              <div className="mt-4 rounded-xl border border-border bg-bg-card p-6">
                <CabinetReadme html={entry.readmeHtml} />
              </div>
            </section>
          )}

          {/* Install */}
          <section>
            <SectionLabel>Install</SectionLabel>
            <div className="mt-4">
              <InstallCommand slug={entry.slug} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
