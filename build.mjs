/**
 * Build script — genera la cartella `dist/` (sito statico) e la committa.
 *
 * L'HTML contiene i segnaposto {{chiave}} che il plugin WordPress
 * "WcodeAi - Frontend GitHub" sostituisce con i campi personalizzati.
 * Se un campo è vuoto, un piccolo script di FALLBACK (iniettato al posto del
 * marcatore <!--FALLBACK-->) mostra i testi/immagini di default presi da
 * `contenuti-esempio.json`: così non si vede mai un {{...}} grezzo e la pagina
 * è completa anche senza WordPress.
 *
 * Output in dist/:
 *   index.html         -> sito con CSS in file separato (style.css)
 *   index-inline.html  -> stesso sito in un unico file (CSS/JS/favicon inline)
 *   style.css, favicon.svg
 *
 * Uso:
 *   npm run build          -> genera dist/
 *   npm run build:commit   -> genera dist/ e committa (git add + git commit)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist");

async function rmrf(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dest);
    else await fs.copyFile(src, dest);
  }
}

/** Converte i marcatori immagine di contenuti-esempio.json in data-URI SVG. */
function toImage(value) {
  if (value.startsWith("IMG:")) {
    const label = value.slice(4);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#3a5a8c'/><stop offset='1' stop-color='#24365c'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><text x='50%' y='50%' fill='#ffffff' opacity='0.85' font-family='Arial' font-size='34' text-anchor='middle'>${label}</text></svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  if (value.startsWith("AV:")) {
    const i = value.slice(3);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='#3a5a8c'/><text x='50%' y='56%' fill='#fff' font-family='Arial' font-size='46' text-anchor='middle'>${i}</text></svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  return value;
}

/** Costruisce lo <script> di fallback dai contenuti d'esempio. */
async function fallbackScript() {
  let data = {};
  try {
    data = JSON.parse(await fs.readFile(path.join(__dirname, "contenuti-esempio.json"), "utf8"));
  } catch {
    console.warn("⚠ contenuti-esempio.json non trovato: nessun fallback iniettato.");
    return "";
  }
  const map = {};
  for (const [k, v] of Object.entries(data)) map[k] = toImage(String(v));
  // Il pattern {{chiave}} non compare mai come letterale qui: costruito a runtime,
  // così il plugin WordPress non tocca questo script.
  return (
    "<script>\n" +
    "(function(){\n" +
    "  var F = " + JSON.stringify(map) + ";\n" +
    "  var RE = new RegExp('\\\\{\\\\{([a-z0-9_]+)\\\\}\\\\}','g');\n" +
    "  var MARK = '{' + '{';\n" +
    "  function fill(s){ return s.replace(RE, function(m,k){ return Object.prototype.hasOwnProperty.call(F,k) ? F[k] : m; }); }\n" +
    "  try { document.title = fill(document.title); } catch(e){}\n" +
    "  var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);\n" +
    "  var n, list = [];\n" +
    "  while ((n = w.nextNode())) { if (n.nodeValue.indexOf(MARK) !== -1) list.push(n); }\n" +
    "  list.forEach(function(t){ t.nodeValue = fill(t.nodeValue); });\n" +
    "  ['src','href','alt','content'].forEach(function(a){\n" +
    "    var els = document.querySelectorAll('[' + a + ']');\n" +
    "    for (var i = 0; i < els.length; i++){ var v = els[i].getAttribute(a); if (v && v.indexOf(MARK) !== -1) els[i].setAttribute(a, fill(v)); }\n" +
    "  });\n" +
    "})();\n" +
    "</" + "script>"
  );
}

function injectFallback(html, script) {
  if (html.includes("<!--FALLBACK-->")) return html.replace("<!--FALLBACK-->", script);
  return html.replace("</body>", script + "\n  </body>");
}

function inlineAssets(html, css, favData) {
  return html
    .replace('href="./favicon.svg"', `href="${favData}"`)
    .replace('<link rel="stylesheet" href="./style.css" />', "<style>\n" + css + "\n    </style>");
}

function tryCommit() {
  try {
    execFileSync("git", ["add", "dist"], { cwd: __dirname, stdio: "inherit" });
    const staged = execFileSync("git", ["diff", "--cached", "--name-only", "--", "dist"], {
      cwd: __dirname,
    })
      .toString()
      .trim();
    if (!staged) {
      console.log("• dist invariata: nessun commit necessario.");
      return;
    }
    execFileSync("git", ["commit", "-m", "build: aggiorna dist"], {
      cwd: __dirname,
      stdio: "inherit",
    });
    console.log("✓ dist committata.");
  } catch (err) {
    console.warn("⚠ Commit non riuscito (probabilmente git non configurato):", err.message);
  }
}

async function main() {
  const shouldCommit = process.argv.includes("--commit");

  await rmrf(DIST);
  await copyDir(SRC, DIST);

  const template = await fs.readFile(path.join(SRC, "index.html"), "utf8");
  const css = await fs.readFile(path.join(SRC, "style.css"), "utf8");
  const favSvg = await fs.readFile(path.join(SRC, "favicon.svg"), "utf8");
  const favData = "data:image/svg+xml;utf8," + encodeURIComponent(favSvg);
  const fb = await fallbackScript();

  // 1) Sito principale (CSS in file separato) con fallback.
  const main = injectFallback(template, fb);
  await fs.writeFile(path.join(DIST, "index.html"), main);

  // 2) Versione single-file (CSS/JS/favicon inline) con fallback.
  const inline = inlineAssets(injectFallback(template, fb), css, favData);
  await fs.writeFile(path.join(DIST, "index-inline.html"), inline);

  console.log("✓ Build completata: dist/index.html + dist/index-inline.html (con fallback).");
  if (shouldCommit) tryCommit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
