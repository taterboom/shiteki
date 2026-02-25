export interface Env {
  GITHUB_TOKEN: string;
}

export interface SendRequestBody {
  owner: string;
  repo: string;
  data: {
    title: string;
    body?: string;
    labels?: string[];
  };
}

export interface SendResponseBody {
  success: true;
  issueUrl: string;
  issueNumber: number;
}

export interface ErrorResponseBody {
  success: false;
  error: string;
}
