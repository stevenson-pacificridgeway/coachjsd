/* CoachJSD — tiny zero-dependency static server for Railway/Node hosting */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const NOT_FOUND_PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found — Coach J. San Diego</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px;
font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
background:radial-gradient(90% 60% at 50% 0%,#3a1170,transparent 60%),#1a0b2e;color:#fff}
h1{font-size:3rem;margin:0 0 8px}p{color:#cdbde6;margin:0 0 24px}
a{display:inline-block;background:#8b2fd6;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px}</style>
</head><body><div><h1>404</h1><p>That page doesn't exist — but your plan still can.</p>
<a href="/">Back to Coach J. San Diego</a></div></body></html>`;

function sendNotFound(res) {
  res.writeHead(404, { "Content-Type": TYPES[".html"], "Cache-Control": "no-cache" }).end(NOT_FOUND_PAGE);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // Retired legacy site — no longer published
  if (urlPath.toLowerCase().startsWith("/john-axys")) {
    sendNotFound(res);
    return;
  }

  // Allow /programs -> /programs.html
  let filePath = path.join(ROOT, urlPath);
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath += ".html";
  }

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Real 404 — never serve the homepage under a bogus URL
      sendNotFound(res);
      return;
    }
    const ext = path.extname(filePath);
    const type = TYPES[ext] || "application/octet-stream";
    // Always-fresh code (revalidate); long cache for versioned media assets
    const cache = [".html", ".css", ".js", ".json"].includes(ext) ? "no-cache" : "public, max-age=604800";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": cache }).end(data);
  });
});

server.listen(PORT, () => console.log(`CoachJSD running on http://localhost:${PORT}`));
