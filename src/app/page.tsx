import { getAllEntries, getAllTags } from "@/lib/registry";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TranspositionHero } from "@/components/registry/transposition-hero";
import { MappingSection, CabinetDefinitionSection } from "@/components/registry/mapping-section";
import { CabinetList } from "@/components/registry/cabinet-list";
import { SectionLabel } from "@/components/ui/section-label";

export default async function HomePage() {
  const entries = await getAllEntries();
  const allTags = await getAllTags();

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <TranspositionHero />
        <MappingSection />
        <CabinetDefinitionSection />

        {/* Browse */}
        <section id="browse" className="mx-auto max-w-4xl px-6 py-16">
          <SectionLabel>Browse</SectionLabel>
          <h2 className="mt-2 font-display text-2xl italic text-text-primary mb-6">
            All Cabinets
          </h2>
          <CabinetList entries={entries} allTags={allTags} />
        </section>
      </main>

      <Footer />
    </>
  );
}
