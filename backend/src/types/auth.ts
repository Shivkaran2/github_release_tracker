export interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  avatar_url: string;
  name: string | null;
}

export interface TokenPayload {
  userId: string;
  githubId: string;
  username: string;
}

