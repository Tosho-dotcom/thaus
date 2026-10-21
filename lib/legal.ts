import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Reads content/legal/<slug>.md at build time for the legal pages. The
// frontmatter holds the title and the "updated" month ("2026-10").

export const legalSlugs = [
  "privacy",
  "terms",
  "cookies",
  "template-license",
] as const;

export type LegalSlug = (typeof legalSlugs)[number];

export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  /** "October 2026" */
  updated: string;
  /** First day of the updated month, for the sitemap. */
  updatedDate: Date;
  /** The opening paragraph, used as the meta description. */
  summary: string;
  body: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-10" (or a parsed Date) -> a Date on the first of that month. */
function parseUpdated(value: unknown) {
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})/.exec(String(value ?? ""));
  if (!match) return new Date();
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
}

/** Strips Markdown emphasis and links so the text works as plain metadata. */
function plain(markdown: string) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

export function getLegalDoc(slug: LegalSlug): LegalDoc {
  const file = readFileSync(
    path.join(process.cwd(), "content", "legal", `${slug}.md`),
    "utf8"
  );
  const { data, content } = matter(file);
  const updatedDate = parseUpdated(data.updated);
  const body = content.trim();

  return {
    slug,
    title: String(data.title ?? ""),
    updated: `${MONTHS[updatedDate.getUTCMonth()]} ${updatedDate.getUTCFullYear()}`,
    updatedDate,
    summary: plain(body.split(/\n\s*\n/)[0] ?? ""),
    body,
  };
}
