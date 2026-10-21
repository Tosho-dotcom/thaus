import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";

export const metadata = legalMetadata("template-license");

export default function Page() {
  return <LegalPage slug="template-license" />;
}
