import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "RONPA - リアルタイム対人ディベート × AI採点",
  description:
    "いつでもどこでも、論理的思考力と説得力を「実践」で鍛える道場。日本初、リアルタイム対人ディベート × AI採点で論理力を磨く。",
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="relative mx-auto min-h-dvh w-full max-w-[430px] bg-bg sm:border-x sm:border-line">
          {children}
        </div>
      </body>
    </html>
  );
}
