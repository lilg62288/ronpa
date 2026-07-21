import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/lib/legal";

export default function PrivacyPage() {
  return <LegalPage docs={privacy} />;
}
