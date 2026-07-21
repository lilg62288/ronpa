// 利用規約・プライバシーポリシーの本文（ドラフト）
// ※法律の専門家によるレビュー前提のテンプレート

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  draftNote: string;
};

const CONTACT = "lil.g62288@gmail.com"; // 運営者連絡先（必要に応じて変更）
const UPDATED = "2026年7月21日";
const UPDATED_EN = "July 21, 2026";

export const terms: Record<"ja" | "en", LegalDoc> = {
  ja: {
    title: "利用規約",
    updated: `最終更新日: ${UPDATED}`,
    intro:
      "この利用規約（以下「本規約」）は、RONPA（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意のうえ本サービスを利用するものとします。",
    draftNote:
      "本規約は暫定版です。正式な運用開始・有料化の前に内容を確定します。",
    sections: [
      {
        heading: "第1条（適用）",
        body: [
          "本規約は、本サービスの提供条件および運営者と利用者との間の権利義務関係を定めるものであり、利用者と運営者との間の本サービスの利用に関わる一切の関係に適用されます。",
        ],
      },
      {
        heading: "第2条（利用登録）",
        body: [
          "利用者は、メールアドレス等の登録情報を提供して利用登録を行うことができます。登録情報は正確かつ最新のものを提供してください。",
          "運営者は、登録希望者に一定の事由があると判断した場合、登録を拒否することがあります。",
        ],
      },
      {
        heading: "第3条（アカウントの管理）",
        body: [
          "利用者は、自己の責任においてアカウントおよびパスワードを管理するものとします。",
          "第三者による不正利用が判明した場合は、速やかに運営者へ連絡してください。",
        ],
      },
      {
        heading: "第4条（禁止事項）",
        body: [
          "利用者は、法令または公序良俗に違反する行為、他の利用者や第三者の権利を侵害する行為、本サービスの運営を妨害する行為、その他運営者が不適切と判断する行為を行ってはなりません。",
        ],
      },
      {
        heading: "第5条（AIによる採点・生成物について）",
        body: [
          "本サービスのディベート相手および採点は、AI（大規模言語モデル）により自動生成されます。生成される内容の正確性・完全性・有用性を保証するものではありません。",
          "AIによる採点・フィードバックはあくまで学習の参考情報であり、資格認定や公的評価等を意味するものではありません。",
        ],
      },
      {
        heading: "第6条（本サービスの提供の停止等）",
        body: [
          "運営者は、システムの保守点検、障害、その他運営上または技術上必要と判断した場合、事前の通知なく本サービスの全部または一部の提供を停止・中断することがあります。",
        ],
      },
      {
        heading: "第7条（免責事項）",
        body: [
          "運営者は、本サービスに関して利用者に生じた損害について、運営者の故意または重過失による場合を除き、一切の責任を負いません。",
          "本サービスは現状有姿で提供され、特定目的への適合性等について保証しません。",
        ],
      },
      {
        heading: "第8条（規約の変更）",
        body: [
          "運営者は、必要と判断した場合、利用者に通知することなく本規約を変更できるものとします。変更後の規約は本サービス上に掲示した時点から効力を生じます。",
        ],
      },
      {
        heading: "第9条（準拠法・裁判管轄）",
        body: [
          "本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。",
        ],
      },
      {
        heading: "第10条（お問い合わせ）",
        body: [`本規約に関するお問い合わせは ${CONTACT} までご連絡ください。`],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: `Last updated: ${UPDATED_EN}`,
    intro:
      "These Terms of Service (the “Terms”) govern your use of RONPA (the “Service”). By using the Service, you agree to these Terms.",
    draftNote:
      "This is a provisional draft. The final version will be fixed before commercial launch.",
    sections: [
      {
        heading: "1. Scope",
        body: [
          "These Terms apply to all relationships between users and the operator concerning the use of the Service.",
        ],
      },
      {
        heading: "2. Registration",
        body: [
          "You may register by providing information such as an email address. Please keep your information accurate and up to date.",
          "The operator may refuse registration at its discretion.",
        ],
      },
      {
        heading: "3. Account management",
        body: [
          "You are responsible for managing your account and password.",
          "Please notify the operator promptly if you discover unauthorized use.",
        ],
      },
      {
        heading: "4. Prohibited conduct",
        body: [
          "You must not violate laws or public order, infringe the rights of others, interfere with the Service, or engage in any conduct the operator deems inappropriate.",
        ],
      },
      {
        heading: "5. AI judging and generated content",
        body: [
          "Your debate opponent and scoring are generated automatically by AI (a large language model). We do not guarantee the accuracy, completeness, or usefulness of generated content.",
          "AI scoring and feedback are reference information for practice only and do not constitute any certification or official evaluation.",
        ],
      },
      {
        heading: "6. Suspension of the Service",
        body: [
          "The operator may suspend or interrupt all or part of the Service without prior notice for maintenance, failures, or other operational or technical reasons.",
        ],
      },
      {
        heading: "7. Disclaimer",
        body: [
          "Except in cases of the operator's intent or gross negligence, the operator is not liable for any damages arising from the use of the Service.",
          "The Service is provided “as is” without warranties of fitness for a particular purpose.",
        ],
      },
      {
        heading: "8. Changes to these Terms",
        body: [
          "The operator may change these Terms when deemed necessary. The revised Terms take effect when posted on the Service.",
        ],
      },
      {
        heading: "9. Governing law and jurisdiction",
        body: [
          "These Terms are governed by the laws of Japan. Any disputes shall be subject to the exclusive jurisdiction of the court having jurisdiction over the operator's location.",
        ],
      },
      {
        heading: "10. Contact",
        body: [`For inquiries about these Terms, contact ${CONTACT}.`],
      },
    ],
  },
};

export const privacy: Record<"ja" | "en", LegalDoc> = {
  ja: {
    title: "プライバシーポリシー",
    updated: `最終更新日: ${UPDATED}`,
    intro:
      "本プライバシーポリシーは、RONPA（以下「本サービス」）における利用者の個人情報の取扱いについて定めるものです。",
    draftNote:
      "本ポリシーは暫定版です。正式な運用開始前に内容を確定します。",
    sections: [
      {
        heading: "1. 取得する情報",
        body: [
          "・メールアドレス、パスワード（認証のため。パスワードは暗号化して保管されます）",
          "・ディベートの発言内容・対戦ログ（AI採点のため）",
          "・利用状況（アクセス日時、利用したモード等）",
          "・言語設定などブラウザに保存される設定情報",
        ],
      },
      {
        heading: "2. 利用目的",
        body: [
          "取得した情報は、本人確認・ログイン、AIによる対戦および採点の提供、サービスの改善・不具合対応、お問い合わせ対応のために利用します。",
        ],
      },
      {
        heading: "3. 外部サービスへの提供",
        body: [
          "本サービスは、機能提供のため以下の外部サービスを利用しており、必要な範囲で情報が送信されます。",
          "・認証・データ保管: Supabase",
          "・AI対戦・採点: OpenAI（ディベートの発言内容が送信されます）",
          "・ホスティング: Vercel / Render",
          "各サービスの情報の取扱いは、それぞれの提供事業者のプライバシーポリシーに従います。",
        ],
      },
      {
        heading: "4. Cookie・ローカルストレージ",
        body: [
          "本サービスは、ログイン状態の保持や言語設定のために、ブラウザのローカルストレージ等を使用します。",
        ],
      },
      {
        heading: "5. 情報の管理",
        body: [
          "運営者は、取得した情報の漏えい・滅失・毀損の防止に努め、適切に管理します。",
        ],
      },
      {
        heading: "6. 開示・訂正・削除",
        body: [
          "利用者は、自己の個人情報の開示・訂正・削除を求めることができます。ご希望の場合は下記お問い合わせ先までご連絡ください。",
        ],
      },
      {
        heading: "7. お問い合わせ",
        body: [
          `本ポリシーに関するお問い合わせは ${CONTACT} までご連絡ください。`,
        ],
      },
      {
        heading: "8. 改定",
        body: [
          "本ポリシーの内容は、必要に応じて変更されることがあります。変更後の内容は本サービス上に掲示した時点から効力を生じます。",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: `Last updated: ${UPDATED_EN}`,
    intro:
      "This Privacy Policy describes how RONPA (the “Service”) handles users' personal information.",
    draftNote:
      "This is a provisional draft. The final version will be fixed before launch.",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "• Email address and password (for authentication; passwords are stored encrypted)",
          "• Debate statements and match logs (for AI scoring)",
          "• Usage data (access times, modes used, etc.)",
          "• Settings stored in your browser, such as language preference",
        ],
      },
      {
        heading: "2. Purpose of use",
        body: [
          "We use the information for authentication and login, providing AI debate and scoring, improving the Service and fixing issues, and responding to inquiries.",
        ],
      },
      {
        heading: "3. Third-party services",
        body: [
          "The Service uses the following third-party services, and information is sent to them as necessary:",
          "• Authentication & data storage: Supabase",
          "• AI debate & scoring: OpenAI (your debate statements are sent)",
          "• Hosting: Vercel / Render",
          "Each provider handles information according to its own privacy policy.",
        ],
      },
      {
        heading: "4. Cookies & local storage",
        body: [
          "The Service uses browser local storage to keep you logged in and remember your language preference.",
        ],
      },
      {
        heading: "5. Data management",
        body: [
          "The operator strives to prevent leakage, loss, or damage of collected information and manages it appropriately.",
        ],
      },
      {
        heading: "6. Disclosure, correction, and deletion",
        body: [
          "You may request disclosure, correction, or deletion of your personal information. Please contact us at the address below.",
        ],
      },
      {
        heading: "7. Contact",
        body: [`For inquiries about this Policy, contact ${CONTACT}.`],
      },
      {
        heading: "8. Revisions",
        body: [
          "This Policy may be revised as needed. Revisions take effect when posted on the Service.",
        ],
      },
    ],
  },
};
