export interface WebhookPayload {
  action?: string;
  release?: {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
    draft: boolean;
    prerelease: boolean;
    html_url: string;
  };
  repository?: {
    id: number;
    full_name: string;
    name: string;
    owner: {
      login: string;
    };
    description: string;
    html_url: string;
  };
}

