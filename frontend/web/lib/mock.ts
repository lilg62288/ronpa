export type Category = "就活" | "時事" | "ビジネス" | "学術";

export const categoryColor: Record<Category, string> = {
  就活: "bg-green-soft text-green",
  時事: "bg-accent-soft text-accent",
  ビジネス: "bg-blue-soft text-blue",
  学術: "bg-gold-soft text-gold",
};

export type PublicRoom = {
  id: string;
  category: Category;
  theme: string;
  members: number;
  capacity: number;
  status: "recruiting" | "live";
};

export const publicRooms: PublicRoom[] = [
  {
    id: "r1",
    category: "時事",
    theme: "日本は救急車を有料化すべきか",
    members: 5,
    capacity: 8,
    status: "recruiting",
  },
  {
    id: "r2",
    category: "就活",
    theme: "新卒一括採用は廃止すべきか",
    members: 8,
    capacity: 8,
    status: "live",
  },
  {
    id: "r3",
    category: "ビジネス",
    theme: "リモートワークを標準とすべきか",
    members: 3,
    capacity: 6,
    status: "recruiting",
  },
  {
    id: "r4",
    category: "学術",
    theme: "AIに著作権を認めるべきか",
    members: 6,
    capacity: 8,
    status: "live",
  },
];

export const newsFeed = [
  {
    id: "n1",
    date: "7/17",
    title: "夏の陣・ランキングイベント開催中！上位100名に称号進呈",
  },
  {
    id: "n2",
    date: "7/15",
    title: "テーマバンクに「時事」カテゴリの新テーマを20件追加",
  },
  {
    id: "n3",
    date: "7/10",
    title: "学生プラン（月額680円）の提供を開始しました",
  },
];

export const themeBank: { category: Category; count: number; sample: string }[] =
  [
    { category: "就活", count: 42, sample: "新卒一括採用は廃止すべきか" },
    { category: "時事", count: 58, sample: "日本は救急車を有料化すべきか" },
    { category: "ビジネス", count: 35, sample: "副業は全面解禁すべきか" },
    { category: "学術", count: 27, sample: "AIに著作権を認めるべきか" },
  ];

export type MatchRecord = {
  id: string;
  date: string;
  theme: string;
  side: "肯定" | "否定";
  result: "WIN" | "LOSE";
  score: number;
};

export const matchHistory: MatchRecord[] = [
  {
    id: "m1",
    date: "7/16",
    theme: "日本は救急車を有料化すべきか",
    side: "肯定",
    result: "WIN",
    score: 32,
  },
  {
    id: "m2",
    date: "7/14",
    theme: "レジ袋の有料化は継続すべきか",
    side: "否定",
    result: "LOSE",
    score: 27,
  },
  {
    id: "m3",
    date: "7/12",
    theme: "週休3日制を導入すべきか",
    side: "肯定",
    result: "WIN",
    score: 30,
  },
];

export const scoreResult = {
  theme: "日本は救急車を有料化すべきか",
  side: "肯定側",
  outcome: "WIN" as const,
  total: 32,
  axes: [
    { key: "logic", label: "論理性", score: 8 },
    { key: "persuasion", label: "説得力", score: 7 },
    { key: "rebuttal", label: "反論力", score: 9 },
    { key: "structure", label: "構成力", score: 8 },
  ],
  good: "反駁フェーズで相手の統計データの出典の曖昧さを的確に突けていた点は高評価。立論での「軽症利用の抑制」という論点設定も、テーマの核心を捉えている。",
  improve:
    "最終弁論の結論が立論の繰り返しに終始しており、新しい説得材料がない。また「〜と思います」が多用され断定を避ける癖があり、説得力を自ら下げている。数値根拠は2件のみで、主張の割に証拠が薄い。",
  summary:
    "総合的には堅実な試合運びだが、勝敗を分けたのは相手の失点であり、自力で崩したとは言い難い。次戦は反駁で得た優位を最終弁論に接続する「流れの設計」を課題とすること。",
};
