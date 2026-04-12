import { TerminalBlock } from "@/components/ui/terminal-block";
import { siteConfig } from "@/lib/site-config";

interface InstallCommandProps {
  slug: string;
}

export function InstallCommand({ slug }: InstallCommandProps) {
  const command = `git clone --filter=blob:none --sparse ${siteConfig.githubRepo}.git && cd cabinets && git sparse-checkout set ${slug}`;

  return (
    <div>
      <TerminalBlock command={command} label="Install" />
    </div>
  );
}
