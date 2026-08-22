import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/ARG_invitation";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: githubPagesBasePath,
      assetPrefix: githubPagesBasePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
