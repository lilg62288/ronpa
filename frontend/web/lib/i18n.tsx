"use client";

// JP/EN 切り替え（UI文言＋モック表示データ）
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ja" | "en";
const STORAGE_KEY = "ronpa:lang";

const ja = {
  nav: { home: "ホーム", battle: "対戦", mypage: "マイページ" },
  school: {
    top: {
      mode: "FOR SCHOOL / 授業向けモード",
      desc1: "授業内のディベート・ディスカッションを音声認識で記録し、",
      desc2: "AIが要約・採点して先生に直接届けます",
      teacherTitle: "先生として使う",
      teacherDesc:
        "課題を作成して参加コードを発行。生徒の提出（要約・採点）をリアルタイムで受信",
      studentTitle: "生徒として参加",
      studentDesc:
        "コードと出席番号で参加。端末を前に置くと発言が記録され、終了時に先生へ送信",
      back: "← 通常モードへ戻る",
    },
    teacher: {
      createTitle: "課題を作成",
      createSub: "作成すると6桁の参加コードが発行され、生徒に共有できます",
      topicLabel: "テーマ",
      topicPh: "例: 日本は救急車を有料化すべきか",
      instLabel: "指示・補足（任意）",
      instPh: "例: 班ごとに肯定・否定に分かれて10分間討論。根拠を最低1つ挙げること",
      nameLabel: "先生の名前（任意）",
      namePh: "例: 田中",
      createBtn: "課題を作成してコードを発行",
      creating: "作成中…",
      createFail: "作成に失敗しました",
      reopenTitle: "発行済みのコードで受信箱を開く",
      reopenSub: "タブを閉じてしまった場合はこちらから復帰できます",
      reopenPh: "6桁コード",
      reopenBtn: "受信箱を開く",
      checking: "確認中…",
      openFail: "受信箱を開けませんでした",
      codeLabel: "参加コード / CLASS CODE",
      shareNote:
        "生徒に「生徒として参加」からこのコードと出席番号を入力してもらってください",
      inbox: "提出受信箱",
      inboxEn: "INBOX",
      pollNote: "5秒ごとに自動更新。生徒が「終了して送信」すると届きます",
      empty: "まだ提出はありません",
      waiting: "受信待機中…",
      noPre: "出席番号 ",
      noPost: " 番",
      submittedSuffix: " 提出",
      axesShort: ["論理", "説得", "反論", "構成"],
      detailOpen: "▼ フィードバック・発言記録を見る",
      detailClose: "▲ 詳細を閉じる",
      good: "良かった点",
      improve: "改善点",
      transcript: "発言記録（文字起こし全文）",
      noRecord: "（記録なし）",
    },
    student: {
      joinTitle: "授業に参加",
      joinSub: "先生の画面に表示されているコードを入力してください",
      codeLabel: "参加コード",
      codePh: "6桁の数字",
      noLabel: "出席番号",
      nameLabel: "名前（任意）",
      namePh: "例: 山田",
      errCode: "参加コードは6桁の数字です",
      errNo: "出席番号を1〜99で入力してください",
      joinFail: "参加に失敗しました",
      joinBtn: "参加する",
      checking: "確認中…",
      todayTheme: "今日のテーマ",
      recStart: "タップして記録開始",
      recStop: "記録中 — タップで一時停止",
      unsupported:
        "このブラウザは音声認識に未対応です（Chrome推奨）。下の入力欄に手入力してください",
      place: "端末を自分の前に置いて、いつも通り議論してください",
      transcript: "発言記録",
      transcriptEn: "TRANSCRIPT",
      trPh: "記録された発言がここに溜まります。誤変換の修正や手入力もできます",
      micDenied:
        "マイクの使用が許可されていません。ブラウザの設定を確認するか、下の入力欄に手入力してください",
      sending: "AIが発言を要約・採点して先生に送信中…",
      sendBtn: "終了して先生に送信",
      sendingBtn: "送信中…",
      sendFail: "送信に失敗しました",
      doneTitle: "先生に送信しました",
      donePost: " ・ お疲れさまでした",
      yourScore: "あなたのスコア",
      goodLabel: "良かった点",
      nextLabel: "次への課題",
      backTop: "トップへ戻る",
    },
  },
  side: { 肯定: "肯定側", 否定: "否定側" },
  levels: { easy: "簡単", normal: "普通", hard: "難しい", oni: "鬼" },
  splash: {
    catch1: "日本初、リアルタイム対人ディベート × AI採点",
    catch2: "論理的思考力と説得力を「実践」で鍛える道場",
    signup: "新規登録で始める",
    login: "ログイン",
    terms:
      "登録すると利用規約とプライバシーポリシーに同意したものとみなされます",
  },
  home: {
    online: "人がオンライン",
    today: "今日の対戦 342件",
    ctaTitle: "AI道場で今すぐ腕試し",
    ctaDesc: "GPT-4oと1対1ディベート。無料プランは1日1回まで",
    ctaBtn: "対戦を始める",
    rooms: "公開ルーム",
    roomsEn: "PUBLIC ROOMS",
    seeAll: "すべて見る",
    live: "対戦中",
    recruiting: "募集中",
    join: "参加する",
    watch: "観戦する",
    news: "ニュース",
    newsEn: "NEWS FEED",
  },
  battle: {
    title: "モード選択",
    titleEn: "SELECT MODE",
    subtitle: "今日はどの流儀で鍛える？",
    aiTag: "SOLO / 1人プレイ",
    aiTitle: "AI道場",
    aiDesc:
      "GPT-4oベースのAIと1対1で対戦。テキスト／音声チャットでいつでも即スタート。",
    randomTag: "RANKED / ランダムマッチ",
    randomTitle: "オンライン対戦",
    randomDesc:
      "全国のユーザーとリアルタイム音声で対人戦。レーティングがかかる真剣勝負。",
    groupTag: "CUSTOM / フレンド・グループ",
    groupTitle: "ルーム作成",
    groupDesc:
      "最大8名のグループディベート。肯定・否定・ジャッジにチーム分けして開催。",
    themeBank: "テーマバンク",
    themeBankEn: "THEME BANK / 162",
    countSuffix: "件",
  },
  mypage: {
    plan: "FREE",
    rank: "初段 ・ RATING",
    stats: ["対戦数", "勝利", "勝率"],
    premiumTitle: "Premiumにアップグレード",
    features: [
      "AI対戦が無制限",
      "AI採点の詳細レポート・改善提案",
      "グループルーム作成が無制限",
      "広告非表示・過去ログ無制限保存",
    ],
    priceBtn: "月額 1,280円で始める",
    studentPlan: "学生プランは月額680円（要学生証認証）",
    history: "過去の対戦",
    historyEn: "BATTLE LOG",
    historyNote: "Freeプランでは直近3件まで保存されます",
    score: "スコア",
    replay: "リプレイを見る",
    menu: ["アカウント設定", "通知設定", "ヘルプ・お問い合わせ"],
    logout: "ログアウト",
  },
  ai: {
    levelSelect: "相手のレベルを選択",
    levelSelectSub: "AIの議論スタイルが変わります",
    levels: {
      easy: "肩慣らし。AIは優しく議論に付き合い、反論の余地を残してくれる。",
      normal: "標準レベル。根拠のある反論が正面から返ってくる。",
      hard: "全国大会レベル。論理の飛躍や根拠の曖昧さを複数論点で執拗に突かれる。",
      oni: "無敗の論破王。全ての穴を突かれ、再反論も先回りで潰される。覚悟せよ。",
    },
    sideSelect: "立場を選択",
    sideSelectSub: "肯定側が先攻で立論します。否定側を選ぶとAIが先に立論します",
    proDesc: "先攻。あなたの立論から試合が始まる",
    conDesc: "後攻。AIの立論への反駁から入る",
    roulette: "🎲 ルーレットで決める",
    spinning: "運命が決めています…",
    rouletteNote: "本番のグループ戦ではランダムに振り分けられます",
    finishBtn: "終了して採点",
    judging: "採点中…",
    selectingTheme: "テーマを選定中…",
    you: "あなた",
    thinking: "反論を構築中…",
    analyzing: "AIが対戦ログを4軸で解析中…",
    placeholder: "主張・反論を入力（Enterで送信）",
    connecting: "接続中…",
    send: "送信",
    turnsPre: "発言",
    turnsPost: "回 — 3回以上の応酬で採点精度が上がります",
  },
  room: {
    phases: [
      "準備",
      "立論・肯定側",
      "立論・否定側",
      "作戦タイム",
      "反駁・肯定側",
      "反駁・否定側",
      "最終弁論・肯定側",
      "最終弁論・否定側",
      "AI採点",
    ],
    steps: ["準備", "立論", "作戦", "反駁", "最終弁論", "採点"],
    theme: "日本は救急車を有料化すべきか",
    category: "時事",
    skip: "スキップ",
    strategyBanner: "作戦タイム中 — チーム内通話のみ可能です",
    aiBanner: "AIが対戦ログを解析中…",
    judge: "ジャッジ:",
    speaking: "発話中",
    viewResult: "採点結果を見る",
    memo: "メモ",
    memoEn: "TACTICAL NOTE",
    memoPlaceholder: "相手の主張の弱点、反駁の要点などをメモ…",
    close: "閉じる",
    micOn: "マイクON",
    muted: "ミュート中",
    leave: "退出",
    players: { misaki: "ミサキ", kenta: "ケンタ", yuta: "ユウタ", aoi: "アオイ" },
  },
  result: {
    title: "採点結果",
    level: "難易度:",
    demo: "— サンプル表示（対戦データなし） —",
    loading: "LOADING RESULT…",
    winPre: "WIN — あなた（",
    winPost: "）の勝利",
    losePre: "LOSE — あなた（",
    losePost: "）の敗北",
    totalLabel: "TOTAL SCORE / 総合スコア",
    good: "良かった点",
    improve: "改善点",
    summary: "総評",
    premiumNote:
      "なら、フェーズ別の詳細レポートと改善提案・全文文字起こしが見られます",
    detail: "詳細",
    again: "もう一度対戦する",
    backHome: "ホームへ戻る",
    axes: {
      logic: "論理性",
      persuasion: "説得力",
      rebuttal: "反論力",
      structure: "構成力",
    },
  },
  data: {
    rooms: [
      {
        id: "r1",
        category: "時事",
        cls: "border-accent/40 bg-accent-soft text-accent",
        theme: "日本は救急車を有料化すべきか",
        members: 5,
        capacity: 8,
        live: false,
      },
      {
        id: "r2",
        category: "就活",
        cls: "border-green/40 bg-green-soft text-green",
        theme: "新卒一括採用は廃止すべきか",
        members: 8,
        capacity: 8,
        live: true,
      },
      {
        id: "r3",
        category: "ビジネス",
        cls: "border-blue/40 bg-blue-soft text-blue",
        theme: "リモートワークを標準とすべきか",
        members: 3,
        capacity: 6,
        live: false,
      },
      {
        id: "r4",
        category: "学術",
        cls: "border-purple/40 bg-purple-soft text-purple",
        theme: "AIに著作権を認めるべきか",
        members: 6,
        capacity: 8,
        live: true,
      },
    ],
    news: [
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
    ],
    themeBank: [
      {
        category: "就活",
        cls: "border-green/40 bg-green-soft text-green",
        count: 42,
        sample: "新卒一括採用は廃止すべきか",
      },
      {
        category: "時事",
        cls: "border-accent/40 bg-accent-soft text-accent",
        count: 58,
        sample: "日本は救急車を有料化すべきか",
      },
      {
        category: "ビジネス",
        cls: "border-blue/40 bg-blue-soft text-blue",
        count: 35,
        sample: "副業は全面解禁すべきか",
      },
      {
        category: "学術",
        cls: "border-purple/40 bg-purple-soft text-purple",
        count: 27,
        sample: "AIに著作権を認めるべきか",
      },
    ],
    history: [
      {
        id: "m1",
        date: "7/16",
        theme: "日本は救急車を有料化すべきか",
        side: "肯定" as const,
        win: true,
        score: 32,
      },
      {
        id: "m2",
        date: "7/14",
        theme: "レジ袋の有料化は継続すべきか",
        side: "否定" as const,
        win: false,
        score: 27,
      },
      {
        id: "m3",
        date: "7/12",
        theme: "週休3日制を導入すべきか",
        side: "肯定" as const,
        win: true,
        score: 30,
      },
    ],
    sample: {
      theme: "日本は救急車を有料化すべきか",
      side: "肯定" as const,
      total: 32,
      axes: { logic: 8, persuasion: 7, rebuttal: 9, structure: 8 },
      good: "反駁フェーズで相手の統計データの出典の曖昧さを的確に突けていた点は高評価。立論での「軽症利用の抑制」という論点設定も、テーマの核心を捉えている。",
      improve:
        "最終弁論の結論が立論の繰り返しに終始しており、新しい説得材料がない。また「〜と思います」が多用され断定を避ける癖があり、説得力を自ら下げている。数値根拠は2件のみで、主張の割に証拠が薄い。",
      summary:
        "総合的には堅実な試合運びだが、勝敗を分けたのは相手の失点であり、自力で崩したとは言い難い。次戦は反駁で得た優位を最終弁論に接続する「流れの設計」を課題とすること。",
    },
  },
};

const en: typeof ja = {
  nav: { home: "Home", battle: "Battle", mypage: "My Page" },
  school: {
    top: {
      mode: "FOR SCHOOL / Classroom Mode",
      desc1: "Record in-class debates & discussions with speech recognition —",
      desc2: "AI summarizes, grades, and delivers straight to the teacher",
      teacherTitle: "Use as a teacher",
      teacherDesc:
        "Create an assignment and issue a class code. Receive student submissions (summary & scores) in real time",
      studentTitle: "Join as a student",
      studentDesc:
        "Join with a code and student number. Place your device in front of you — your speech is recorded and sent to the teacher",
      back: "← Back to normal mode",
    },
    teacher: {
      createTitle: "Create an assignment",
      createSub: "A 6-digit class code will be issued to share with students",
      topicLabel: "Topic",
      topicPh: "e.g. Should ambulance services charge a fee?",
      instLabel: "Instructions (optional)",
      instPh: "e.g. Split into Pro/Con teams, debate for 10 minutes. Give at least one piece of evidence",
      nameLabel: "Teacher name (optional)",
      namePh: "e.g. Tanaka",
      createBtn: "Create & issue code",
      creating: "Creating…",
      createFail: "Failed to create",
      reopenTitle: "Open inbox with an existing code",
      reopenSub: "Closed the tab? Recover your inbox here",
      reopenPh: "6-digit code",
      reopenBtn: "Open inbox",
      checking: "Checking…",
      openFail: "Could not open the inbox",
      codeLabel: "CLASS CODE",
      shareNote:
        'Have students enter this code and their student number from "Join as a student"',
      inbox: "Inbox",
      inboxEn: "受信箱",
      pollNote: "Auto-refreshes every 5s. Submissions appear when students finish",
      empty: "No submissions yet",
      waiting: "Listening…",
      noPre: "Student No. ",
      noPost: "",
      submittedSuffix: " submitted",
      axesShort: ["Logic", "Persu.", "Rebut.", "Struct."],
      detailOpen: "▼ View feedback & transcript",
      detailClose: "▲ Close details",
      good: "Strengths",
      improve: "To improve",
      transcript: "Transcript (full)",
      noRecord: "(no record)",
    },
    student: {
      joinTitle: "Join the class",
      joinSub: "Enter the code shown on your teacher's screen",
      codeLabel: "Class code",
      codePh: "6 digits",
      noLabel: "Student No.",
      nameLabel: "Name (optional)",
      namePh: "e.g. Yamada",
      errCode: "The class code is 6 digits",
      errNo: "Enter a student number from 1-99",
      joinFail: "Failed to join",
      joinBtn: "Join",
      checking: "Checking…",
      todayTheme: "TODAY'S TOPIC",
      recStart: "Tap to start recording",
      recStop: "Recording — tap to pause",
      unsupported:
        "This browser doesn't support speech recognition (Chrome recommended). Type into the box below instead",
      place: "Place the device in front of you and discuss as usual",
      transcript: "Transcript",
      transcriptEn: "発言記録",
      trPh: "Your recorded speech accumulates here. Fix errors or type manually",
      micDenied:
        "Microphone access denied. Check your browser settings or type into the box below",
      sending: "AI is summarizing, grading, and sending to your teacher…",
      sendBtn: "Finish & send to teacher",
      sendingBtn: "Sending…",
      sendFail: "Failed to send",
      doneTitle: "Sent to your teacher",
      donePost: " ・ Good work!",
      yourScore: "YOUR SCORE",
      goodLabel: "Strengths",
      nextLabel: "Next challenge",
      backTop: "Back to top",
    },
  },
  side: { 肯定: "Pro", 否定: "Con" },
  levels: { easy: "Easy", normal: "Normal", hard: "Hard", oni: "Oni" },
  splash: {
    catch1: "Japan-born realtime debate arena × AI judging",
    catch2: "A dojo to train logic and persuasion through real practice",
    signup: "Sign up & start",
    login: "Log in",
    terms: "By signing up, you agree to our Terms of Service and Privacy Policy",
  },
  home: {
    online: " online now",
    today: "342 battles today",
    ctaTitle: "Test your skills in the AI Dojo",
    ctaDesc: "1-on-1 debate with GPT-4o. Free plan: once per day",
    ctaBtn: "Start battle",
    rooms: "Public Rooms",
    roomsEn: "公開ルーム",
    seeAll: "See all",
    live: "LIVE",
    recruiting: "Open",
    join: "Join",
    watch: "Watch",
    news: "News",
    newsEn: "ニュース",
  },
  battle: {
    title: "Select Mode",
    titleEn: "モード選択",
    subtitle: "Which style will you train today?",
    aiTag: "SOLO / Single player",
    aiTitle: "AI Dojo",
    aiDesc:
      "1-on-1 against a GPT-4o opponent. Text or voice chat, start anytime.",
    randomTag: "RANKED / Random match",
    randomTitle: "Online Battle",
    randomDesc:
      "Realtime voice battles against users nationwide. Rating on the line.",
    groupTag: "CUSTOM / Friends & groups",
    groupTitle: "Create Room",
    groupDesc:
      "Group debates up to 8 people. Split into Pro, Con, and judges.",
    themeBank: "Theme Bank",
    themeBankEn: "テーマバンク / 162",
    countSuffix: "",
  },
  mypage: {
    plan: "FREE",
    rank: "Shodan ・ RATING",
    stats: ["Battles", "Wins", "Win rate"],
    premiumTitle: "Upgrade to Premium",
    features: [
      "Unlimited AI battles",
      "Detailed AI reports & improvement tips",
      "Unlimited group room creation",
      "Ad-free & unlimited battle log storage",
    ],
    priceBtn: "Start for ¥1,280/mo",
    studentPlan: "Student plan: ¥680/mo (student ID required)",
    history: "Battle Log",
    historyEn: "過去の対戦",
    historyNote: "Free plan keeps your last 3 battles",
    score: "Score",
    replay: "View replay",
    menu: ["Account settings", "Notifications", "Help & support"],
    logout: "Log out",
  },
  ai: {
    levelSelect: "Choose your opponent's level",
    levelSelectSub: "Changes the AI's debating style",
    levels: {
      easy: "Warm-up. The AI debates gently and leaves openings for you.",
      normal: "Standard level. Well-grounded rebuttals come straight at you.",
      hard: "National-tournament level. Relentless attacks on every weak point.",
      oni: "The undefeated champion. Every hole exposed, every comeback crushed.",
    },
    sideSelect: "Choose your side",
    sideSelectSub: "Pro speaks first. Choose Con and the AI opens the debate",
    proDesc: "First speaker. The match starts with your argument",
    conDesc: "Second speaker. You start by rebutting the AI's argument",
    roulette: "🎲 Spin the roulette",
    spinning: "Fate is deciding…",
    rouletteNote: "In real group battles, sides are assigned randomly",
    finishBtn: "Finish & judge",
    judging: "Judging…",
    selectingTheme: "Selecting topic…",
    you: "You",
    thinking: "Composing rebuttal…",
    analyzing: "AI is analyzing the debate on 4 axes…",
    placeholder: "Type your argument (Enter to send)",
    connecting: "Connecting…",
    send: "Send",
    turnsPre: "Turns:",
    turnsPost: " — 3+ exchanges improve judging accuracy",
  },
  room: {
    phases: [
      "Prep",
      "Opening – Pro",
      "Opening – Con",
      "Strategy",
      "Rebuttal – Pro",
      "Rebuttal – Con",
      "Closing – Pro",
      "Closing – Con",
      "AI Judging",
    ],
    steps: ["Prep", "Opening", "Strategy", "Rebuttal", "Closing", "Judge"],
    theme: "Should ambulance services charge a fee?",
    category: "Current Affairs",
    skip: "Skip",
    strategyBanner: "Strategy time — team-only voice channel",
    aiBanner: "AI is analyzing the debate log…",
    judge: "Judge:",
    speaking: "Speaking",
    viewResult: "View results",
    memo: "Note",
    memoEn: "TACTICAL NOTE",
    memoPlaceholder: "Note weaknesses in their argument, rebuttal points…",
    close: "Close",
    micOn: "Mic ON",
    muted: "Muted",
    leave: "Leave",
    players: { misaki: "Misaki", kenta: "Kenta", yuta: "Yuta", aoi: "Aoi" },
  },
  result: {
    title: "Results",
    level: "Level:",
    demo: "— Sample data (no battle record) —",
    loading: "LOADING RESULT…",
    winPre: "WIN — You (",
    winPost: ") won",
    losePre: "LOSE — You (",
    losePost: ") lost",
    totalLabel: "TOTAL SCORE",
    good: "Strengths",
    improve: "To improve",
    summary: "Overall",
    premiumNote:
      " unlocks per-phase detailed reports, improvement tips, and full transcripts",
    detail: "More",
    again: "Battle again",
    backHome: "Back to home",
    axes: {
      logic: "Logic",
      persuasion: "Persuasion",
      rebuttal: "Rebuttal",
      structure: "Structure",
    },
  },
  data: {
    rooms: [
      {
        id: "r1",
        category: "Current Affairs",
        cls: "border-accent/40 bg-accent-soft text-accent",
        theme: "Should ambulance services charge a fee?",
        members: 5,
        capacity: 8,
        live: false,
      },
      {
        id: "r2",
        category: "Careers",
        cls: "border-green/40 bg-green-soft text-green",
        theme: "Should mass hiring of new graduates be abolished?",
        members: 8,
        capacity: 8,
        live: true,
      },
      {
        id: "r3",
        category: "Business",
        cls: "border-blue/40 bg-blue-soft text-blue",
        theme: "Should remote work become the standard?",
        members: 3,
        capacity: 6,
        live: false,
      },
      {
        id: "r4",
        category: "Academia",
        cls: "border-purple/40 bg-purple-soft text-purple",
        theme: "Should AI-generated works be granted copyright?",
        members: 6,
        capacity: 8,
        live: true,
      },
    ],
    news: [
      {
        id: "n1",
        date: "7/17",
        title: "Summer ranking event is live! Titles for the top 100",
      },
      {
        id: "n2",
        date: "7/15",
        title: "20 new Current Affairs topics added to the Theme Bank",
      },
      {
        id: "n3",
        date: "7/10",
        title: "Student plan (¥680/mo) is now available",
      },
    ],
    themeBank: [
      {
        category: "Careers",
        cls: "border-green/40 bg-green-soft text-green",
        count: 42,
        sample: "Should mass hiring of new graduates be abolished?",
      },
      {
        category: "Current Affairs",
        cls: "border-accent/40 bg-accent-soft text-accent",
        count: 58,
        sample: "Should ambulance services charge a fee?",
      },
      {
        category: "Business",
        cls: "border-blue/40 bg-blue-soft text-blue",
        count: 35,
        sample: "Should side jobs be fully liberalized?",
      },
      {
        category: "Academia",
        cls: "border-purple/40 bg-purple-soft text-purple",
        count: 27,
        sample: "Should AI-generated works be granted copyright?",
      },
    ],
    history: [
      {
        id: "m1",
        date: "7/16",
        theme: "Should ambulance services charge a fee?",
        side: "肯定" as const,
        win: true,
        score: 32,
      },
      {
        id: "m2",
        date: "7/14",
        theme: "Should plastic bag fees be continued?",
        side: "否定" as const,
        win: false,
        score: 27,
      },
      {
        id: "m3",
        date: "7/12",
        theme: "Should companies adopt a four-day workweek?",
        side: "肯定" as const,
        win: true,
        score: 30,
      },
    ],
    sample: {
      theme: "Should ambulance services charge a fee?",
      side: "肯定" as const,
      total: 32,
      axes: { logic: 8, persuasion: 7, rebuttal: 9, structure: 8 },
      good: "Sharp attack on the vague sourcing of the opponent's statistics during rebuttal. Framing the debate around curbing non-urgent use hit the core of the topic.",
      improve:
        "Your closing merely repeated the opening with no new persuasive material. Frequent hedging weakened your delivery, and only two numerical facts backed a large claim.",
      summary:
        "A solid match overall, but the win came from the opponent's mistakes rather than your own decisive play. Next time, design the flow so your rebuttal advantage carries into the closing.",
    },
  },
};

export const translations = { ja, en };
export type Dict = typeof ja;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "ja", setLang: () => {}, t: ja });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "en") setLangState("en");
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Provider のハイドレーションを待たずに現在の言語を取得する（クライアント専用） */
export function currentLang(): Lang {
  if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "en") {
    return "en";
  }
  return "ja";
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={`flex overflow-hidden rounded-full border border-line bg-surface/80 text-[10px] font-bold ${className}`}
    >
      {(["ja", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 ${
            lang === l ? "bg-cyan text-[#02131a]" : "text-ink-3 hover:text-ink"
          }`}
        >
          {l === "ja" ? "JP" : "EN"}
        </button>
      ))}
    </div>
  );
}
