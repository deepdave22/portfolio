import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export: `next build` emits a plain `out/` folder of HTML/CSS/JS,
   * which deploys free on Vercel, GitHub Pages, Netlify or any static host.
   */
  output: "export",
  images: {
    // No image optimisation server exists in a static export.
    unoptimized: true,
  },
  // Emits /about/index.html style paths — safest across static hosts.
  trailingSlash: true,

  /**
   * Inline the (small, Tailwind-generated) stylesheet into the HTML. Removes the
   * render-blocking CSS request from the critical path, which is the right trade
   * for a one-page site whose visitors are mostly first-timers. Experimental —
   * see node_modules/next/dist/docs/.../inlineCss.md.
   */
  experimental: {
    inlineCss: true,
  },

  /**
   * Opt-in relative asset paths, for serving the exported folder from a
   * sub-path rather than a domain root (preview hosts, file://, a folder
   * inside another site). Leave it unset for Vercel.
   *
   *   ASSET_PREFIX=. npm run build        -> ./_next/...
   *   ASSET_PREFIX=./assets npm run build -> ./assets/_next/...
   *
   * The second form matters for hosts that reserve top-level paths beginning
   * with an underscore.
   */
  ...(process.env.ASSET_PREFIX ? { assetPrefix: process.env.ASSET_PREFIX } : {}),
};

export default nextConfig;
