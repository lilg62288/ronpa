// 学校向けAPIクライアント
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Assignment = {
  code: string;
  theme: string;
  instructions: string;
  teacher_name: string;
};

export type SubmissionScores = {
  logic: number;
  persuasion: number;
  rebuttal: number;
  structure: number;
};

export type Submission = {
  student_number: number;
  student_name: string;
  summary: string;
  scores: SubmissionScores;
  total: number;
  good: string;
  improve: string;
  transcript: string;
  submitted_at: number;
};

export type SubmissionList = {
  code: string;
  theme: string;
  instructions: string;
  count: number;
  submissions: Submission[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const detail = await res
      .json()
      .then((d) => d.detail)
      .catch(() => res.statusText);
    throw new Error(typeof detail === "string" ? detail : "APIエラー");
  }
  return res.json();
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createAssignment(
  theme: string,
  instructions: string,
  teacherName: string,
): Promise<Assignment> {
  return post("/api/school/assignments", {
    theme,
    instructions,
    teacher_name: teacherName,
  });
}

export function getAssignment(code: string): Promise<Assignment> {
  return request(`/api/school/assignments/${encodeURIComponent(code)}`);
}

export function submitTranscript(
  code: string,
  studentNumber: number,
  transcript: string,
  studentName = "",
): Promise<Submission> {
  return post("/api/school/submissions", {
    code,
    student_number: studentNumber,
    student_name: studentName,
    transcript,
  });
}

export function listSubmissions(code: string): Promise<SubmissionList> {
  return request(
    `/api/school/assignments/${encodeURIComponent(code)}/submissions`,
  );
}
