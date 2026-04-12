import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-warm">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="section-label mb-3">Registry</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-accent transition-colors">
                  Browse Cabinets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/spec" className="text-text-secondary hover:text-accent transition-colors">
                  File Format Spec
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="section-label mb-3">Cabinet</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={siteConfig.cabinetSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Main Website
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="section-label mb-3">Contribute</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`${siteConfig.githubRepo}#contributing`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Add a Cabinet
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="section-label mb-3">About</h3>
            <p className="text-sm text-text-tertiary font-body-serif">
              A public registry of portable, file-system native operating units for AI-powered business functions.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-text-tertiary">
            Built for{" "}
            <a
              href={siteConfig.cabinetSite}
              className="text-accent hover:text-accent-warm transition-colors"
            >
              Cabinet
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
