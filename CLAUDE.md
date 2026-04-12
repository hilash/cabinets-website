# Cabinet Registry Website

Next.js website that renders the public cabinet registry.

## Architecture

- **This repo** (`cabinets-website`): Contains the Next.js website source.
- **Public repo** (`cabinets`): Contains the cabinet template directories.
- At build time, CI clones the public repo into `registry/` then builds the static site.

## Local Development

```bash
# Copy the registry (Turbopack does not support symlinks outside project root)
cp -r ../cabinets registry && rm -rf registry/.git
npm run dev
```

## Conventions

- Design matches cabinet-website exactly: same CSS tokens, same 4 fonts, same warm parchment aesthetic.
- Static export (`output: "export"`) for GitHub Pages deployment.
- All cabinet data is parsed at build time in `src/lib/registry.ts`.
- `registry/` is gitignored — it is cloned during CI, never committed here.
