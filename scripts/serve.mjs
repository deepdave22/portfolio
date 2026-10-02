/**
 * Minimal static server for the exported site.
 *
 *   node scripts/serve.mjs [port]
 *
 * Serves ./out the way a static host would: directory URLs resolve to
 * index.html, unknown paths fall back to 404.html, and it binds on all
 * interfaces so you can open the site on your phone over the same Wi-Fi.
 */

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { createGzip } from "node:zlib";
import { stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { networkInterfaces } from "node:os";

const ROOT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PORT = Number(process.argv[2] ?? 4000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function resolve(urlPath) {
  // Strip the query string and block path traversal above the export root.
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, "");
  let target = join(ROOT, safe);

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, "index.html");
    else return target;
  } catch {
    // Try the .html sibling for extensionless URLs before giving up.
    if (!extname(target)) {
      for (const candidate of [`${target}.html`, join(target, "index.html")]) {
        try {
          await stat(candidate);
          return candidate;
        } catch {
          /* keep looking */
        }
      }
    }
    return null;
  }

  try {
    await stat(target);
    return target;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await resolve(req.url ?? "/");
  if (!file) {
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "content-type": TYPES[".html"] });
    createReadStream(notFound).on("error", () => res.end("404")).pipe(res);
    return;
  }
  const type = TYPES[extname(file).toLowerCase()] ?? "application/octet-stream";
  // Gzip text the way any real host does — without this, local Lighthouse runs
  // report a "text compression" penalty the deployed site will never have.
  const compressible = /^(text\/|application\/(javascript|json|xml))/.test(type);
  const wantsGzip = /gzip/.test(req.headers["accept-encoding"] ?? "");

  if (compressible && wantsGzip) {
    res.writeHead(200, {
      "content-type": type,
      "content-encoding": "gzip",
      vary: "Accept-Encoding",
      "cache-control": "no-cache",
    });
    createReadStream(file).pipe(createGzip()).pipe(res);
    return;
  }

  res.writeHead(200, { "content-type": type, "cache-control": "no-cache" });
  createReadStream(file).pipe(res);
});

server.listen(PORT, "0.0.0.0", () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .find((n) => n && n.family === "IPv4" && !n.internal)?.address;
  console.log(`  Local:   http://localhost:${PORT}`);
  if (lan) console.log(`  Network: http://${lan}:${PORT}`);
  console.log("  Serving ./out — Ctrl+C to stop");
});
