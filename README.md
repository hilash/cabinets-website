# Cabinet Registry Website

Next.js website for browsing and installing [cabinet](https://github.com/hilash/cabinets) templates — portable blueprints for AI-powered business operations.

**Live site:** [runcabinet.com](https://runcabinet.com)

## Architecture

- **This repo** — Next.js static site (deployed to GitHub Pages).
- **[cabinets](https://github.com/hilash/cabinets)** — The public registry of cabinet templates.
- At build time, CI clones the cabinets repo into `registry/` and builds the static export.

## Local Development

```bash
# Copy the registry (Turbopack does not support symlinks outside project root)
cp -r ../cabinets registry && rm -rf registry/.git
npm install
npm run dev
```

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with static export
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Framer Motion](https://www.framer.com/motion/)
- Deployed via GitHub Pages

## License

MIT
