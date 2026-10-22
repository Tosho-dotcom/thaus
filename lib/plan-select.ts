// Options for the contact form's "What do you need?" select. Pricing CTAs
// open the contact modal with one of these preselected.

export const projectTypes = [
  "Foundation",
  "Full Haus",
  "Custom",
  "Not sure yet",
] as const;

export type ProjectType = (typeof projectTypes)[number];
