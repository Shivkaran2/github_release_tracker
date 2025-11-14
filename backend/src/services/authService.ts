import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import type { GitHubUser, TokenPayload } from '../types/auth';
import { JWT_EXPIRY, GITHUB_OAUTH_SCOPES } from '../constants';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

export class AuthService {
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to exchange code for token: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as {
        access_token?: string;
        token_type?: string;
        scope?: string;
        error?: string;
        error_description?: string;
      };

      if (data.error) {
        throw new Error(
          `GitHub OAuth error: ${data.error} - ${data.error_description || 'Unknown error'}`,
        );
      }

      if (!data.access_token) {
        throw new Error('No access token received from GitHub');
      }

      return data.access_token;
    } catch (error) {
      throw error;
    }
  }

  async fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch GitHub user: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const userData = (await response.json()) as GitHubUser;
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateUser(githubUser: GitHubUser, accessToken: string): Promise<string> {
    try {
      const user = await prisma.user.upsert({
        where: {
          githubId: githubUser.id.toString(),
        },
        update: {
          username: githubUser.login,
          email: githubUser.email || null,
          avatarUrl: githubUser.avatar_url,
          accessToken,
          updatedAt: new Date(),
        },
        create: {
          githubId: githubUser.id.toString(),
          username: githubUser.login,
          email: githubUser.email || null,
          avatarUrl: githubUser.avatar_url,
          accessToken,
        },
      });

      return user.id;
    } catch (error) {
      throw error;
    }
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  async getUserFromToken(token: string): Promise<string | null> {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return user ? user.id : null;
  }

  getGitHubAuthUrl(redirectUri?: string): string {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const callbackUrl = redirectUri || `${backendUrl}/auth/github/callback`;
    
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: callbackUrl,
      scope: GITHUB_OAUTH_SCOPES,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }
}

export const authService = new AuthService();

