export interface ShijiConfig {
  mode: "endpoint" | "direct";
  endpoint: string;
  githubToken: string;
  owner: string;
  repo: string;
  labels?: string[];
}

export interface ElementInfo {
  selector: string;
  tagName: string;
  textContent: string;
  rect: { top: number; left: number; width: number; height: number };
  attributes: Record<string, string>;
}

export interface Annotation {
  id: number;
  elementInfo: ElementInfo;
  comment: string;
  createdAt: number;
}

export type WidgetMode = "idle" | "picking" | "annotating";

export interface SubmitResult {
  issueUrl: string;
  issueNumber: number;
}

export type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: SubmitResult }
  | { status: "error"; error: string };
