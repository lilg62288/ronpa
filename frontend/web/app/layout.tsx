import type { Metadata, Viewport } from "next";
import { Orbitron, Zen_Kaku_Gothic_New } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "RONPA - リアルタイム対人ディベート × AI採点",
  description:
    "いつでもどこでも、論理的思考力と説得力を「実践」で鍛える道場。日本初、リアルタイム対人ディベート × AI採点で論理力を磨く。",
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${orbitron.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LangProvider>
          <AuthProvider>
            <div className="bg-grid relative mx-auto min-h-dvh w-full max-w-[430px] bg-bg sm:border-x sm:border-line">
              {children}
            </div>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
