import { mkdir, readFile, writeFile } from "node:fs/promises";
import { notFoundMetadata, routeMetadata, siteOrigin } from "../src/metadata.js";

const escapeHtml = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const homepage = new URL("../dist/index.html", import.meta.url);
const template = await readFile(homepage, "utf8");

function renderMetadata(html, path, metadata) {
  const canonical = `${siteOrigin}${path === "/" ? "" : path}`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
}

await writeFile(homepage, renderMetadata(template, "/", routeMetadata["/"]));
await writeFile(new URL("../dist/404.html", import.meta.url), renderMetadata(template, "/404", notFoundMetadata));

for (const [path, metadata] of Object.entries(routeMetadata)) {
  if (path === "/") continue;
  const route = path.slice(1);
  const directory = new URL(`../dist/${route}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), renderMetadata(template, path, metadata));
}
