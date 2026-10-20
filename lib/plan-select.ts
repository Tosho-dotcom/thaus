// Pricing CTAs preselect the contact form's "What do you need?" option. The
// CTA keeps its plain #contact href for the scroll; the selection travels as a
// window event the contact form listens for.

export const projectTypes = [
  "Foundation",
  "Full Haus",
  "Custom",
  "Not sure yet",
] as const;

export type ProjectType = (typeof projectTypes)[number];

const EVENT = "thaus:select-plan";

export function selectPlan(plan: ProjectType) {
  window.dispatchEvent(new CustomEvent<ProjectType>(EVENT, { detail: plan }));
}

export function onPlanSelect(handler: (plan: ProjectType) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ProjectType>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
