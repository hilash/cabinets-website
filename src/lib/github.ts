import { siteConfig } from "./site-config";

export async function getGitHubStars(): Promise<number | null> {
  try {
    // Extract owner/repo from the GitHub URL
    const match = siteConfig.githubRepo.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );
    if (!match) return null;

    const [, owner, repo] = match;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}
