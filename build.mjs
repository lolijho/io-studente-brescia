/**
 * Build script — genera la cartella `dist/` (sito statico) e la committa.
 *
 * Copia ricorsivamente il contenuto di `src/` in `dist/`.
 * Nessun processo Node è richiesto a runtime: l'output è puro HTML/CSS.
 * L'HTML contiene i segnaposto {{chiave}} che il plugin WordPress
 * "WcodeAi - Frontend GitHub" sostituisce con i campi personalizzati.
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
    if (entry.isDirectory()) {
      await copyDir(src, dest);
    } else {
      await fs.copyFile(src, dest);
    }
  }
}

function tryCommit() {
  try {
    execFileSync("git", ["add", "dist"], { cwd: __dirname, stdio: "inherit" });
    // Committa solo se ci sono modifiche nella dist.
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

async function buildInline() {
  // Versione single-file: CSS in <style> e favicon come data-URI (JS già inline).
  let html = await fs.readFile(path.join(SRC, "index.html"), "utf8");
  const css = await fs.readFile(path.join(SRC, "style.css"), "utf8");
  const favSvg = await fs.readFile(path.join(SRC, "favicon.svg"), "utf8");
  const favData = "data:image/svg+xml;utf8," + encodeURIComponent(favSvg);
  html = html.replace('href="./favicon.svg"', `href="${favData}"`);
  html = html.replace(
    '<link rel="stylesheet" href="./style.css" />',
    "<style>\n" + css + "\n    </style>"
  );
  await fs.writeFile(path.join(DIST, "index-inline.html"), html);
}

async function main() {
  const shouldCommit = process.argv.includes("--commit");
  await rmrf(DIST);
  await copyDir(SRC, DIST);
  await buildInline();
  console.log("✓ Build completata: dist/ generata da src/ (+ index-inline.html single-file).");
  if (shouldCommit) tryCommit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
