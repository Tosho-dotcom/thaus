import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Parses content/blueprint.md at build time into the pieces the /blueprint
// page lays out: frontmatter, the intro before the first H2, and one entry per
// H2 section (which also drive the table of contents).

export interface BlueprintSection {
  id: string;
  /** "01" for "## 1. Title"; undefined for unnumbered headings. */
  number?: string;
  title: string;
  body: string;
}

export interface Blueprint {
  title: string;
  description: string;
  version: string;
  updated: string;
  intro: string;
  sections: BlueprintSection[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** YAML reads `version: 1.0` as the number 1, so restore the decimal. */
function formatVersion(value: unknown) {
  if (typeof value === "number") return value.toFixed(1);
  return String(value ?? "");
}

/** "2026-10" (or a parsed Date) -> "Oct 2026". */
function formatUpdated(value: unknown) {
  if (value instanceof Date) {
    return `${MONTHS[value.getUTCMonth()]} ${value.getUTCFullYear()}`;
  }
  const match = /^(\d{4})-(\d{2})/.exec(String(value ?? ""));
  if (!match) return String(value ?? "");
  return `${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

/** Section dividers are drawn by the layout, so drop the Markdown `---` rules. */
function stripRules(markdown: string) {
  return markdown.replace(/^\s*---\s*$/gm, "").trim();
}

export function getBlueprint(): Blueprint {
  const file = readFileSync(
    path.join(process.cwd(), "content", "blueprint.md"),
    "utf8"
  );
  const { data, content } = matter(file);

  // The cover renders the title, so the Markdown H1 is dropped.
  const [intro, ...chunks] = content
    .replace(/^#\s+.*$/m, "")
    .split(/^##\s+/m);

  const sections = chunks.map((chunk) => {
    const newline = chunk.indexOf("\n");
    const heading = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const body = newline === -1 ? "" : chunk.slice(newline + 1);
    const numbered = /^(\d+)\.\s+(.*)$/.exec(heading);
    const title = numbered ? numbered[2] : heading;

    return {
      id: slugify(title),
      number: numbered ? numbered[1].padStart(2, "0") : undefined,
      title,
      body: stripRules(body),
    };
  });

  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    version: formatVersion(data.version),
    updated: formatUpdated(data.updated),
    intro: stripRules(intro),
    sections,
  };
}
