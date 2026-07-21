import { LegalPage } from "@/components/LegalPage";
import { terms } from "@/lib/legal";

export default function TermsPage() {
  return <LegalPage docs={terms} />;
}
