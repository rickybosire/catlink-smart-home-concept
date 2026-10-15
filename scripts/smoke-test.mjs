import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { notFoundMetadata, routeMetadata, siteOrigin } from "../src/metadata.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = join(projectRoot, "dist");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function checkHtml(path, metadata, filename) {
  const html = await readFile(filename, "utf8");
  const canonical = `${siteOrigin}${path === "/" ? "" : path}`;
  check(html.includes(`<title>${metadata.title}</title>`), `${path}: incorrect title`);
  check(html.includes(`name="description" content="${metadata.description}"`), `${path}: incorrect description`);
  check(html.includes(`property="og:title" content="${metadata.title}"`), `${path}: incorrect Open Graph title`);
  check(html.includes(`rel="canonical" href="${canonical}"`), `${path}: incorrect canonical URL`);
  for (const source of html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)[^\"]*"/g)) {
    try {
      await access(join(distRoot, source[1]), constants.R_OK);
    } catch {
      failures.push(`${path}: missing generated asset ${source[1]}`);
    }
  }
}

for (const [path, metadata] of Object.entries(routeMetadata)) {
  const filename = path === "/" ? join(distRoot, "index.html") : join(distRoot, path.slice(1), "index.html");
  await checkHtml(path, metadata, filename);
}
await checkHtml("/404", notFoundMetadata, join(distRoot, "404.html"));

const baseUrl = process.env.SMOKE_BASE_URL;
if (baseUrl) {
  const nodeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
  const playwrightPath = nodeModules ? join(nodeModules, "playwright", "index.mjs") : "playwright";
  const { chromium } = await import(playwrightPath);
  const browser = process.env.SMOKE_CDP_ENDPOINT
    ? await chromium.connectOverCDP(process.env.SMOKE_CDP_ENDPOINT)
    : await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {});
  const page = await browser.newPage();
  const browserErrors = [];
  page.on("console", message => {
    if (message.type() === "error") browserErrors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", error => browserErrors.push(`runtime: ${error.message}`));
  page.on("requestfailed", request => {
    if (request.resourceType() === "image") browserErrors.push(`image: ${request.url()} (${request.failure()?.errorText || "failed"})`);
  });
  const widths = [320, 375, 768, 1440];
  const paths = [...Object.keys(routeMetadata), "/this-route-does-not-exist"];
  for (const path of paths) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(new URL(path, baseUrl).toString(), { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 1, `${path} at ${width}px: ${overflow}px horizontal overflow`);
    }
  }
  failures.push(...browserErrors);
  await browser.close();
} else {
  console.log("Browser checks skipped: set SMOKE_BASE_URL and provide a Playwright browser or CDP endpoint.");
}

if (failures.length) {
  console.error(`Smoke test failed (${failures.length})`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Static route smoke checks passed for ${Object.keys(routeMetadata).length} routes plus 404.`);
