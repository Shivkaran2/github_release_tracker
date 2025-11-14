import express from 'express';
import { authService } from '../services/authService';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export function setupAuthRoutes(app: express.Application): void {
  app.get('/auth/github', (req, res) => {
    try {
      const authUrl = authService.getGitHubAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/auth/error?error=auth_url_generation_failed`);
    }
  });

  app.get('/auth/github/callback', async (req, res) => {
    try {
      const code = req.query.code as string;
      const error = req.query.error as string;
      const errorDescription = req.query.error_description as string;

      if (error) {
        return res.redirect(
          `${FRONTEND_URL}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`,
        );
      }

      if (!code) {
        return res.redirect(`${FRONTEND_URL}/auth/error?error=missing_code`);
      }

      let accessToken: string;
      try {
        accessToken = await authService.exchangeCodeForToken(code);
      } catch (tokenError) {
        return res.redirect(`${FRONTEND_URL}/auth/error?error=token_exchange_failed`);
      }

      let githubUser;
      try {
        githubUser = await authService.fetchGitHubUser(accessToken);
      } catch (userError) {
        return res.redirect(`${FRONTEND_URL}/auth/error?error=user_fetch_failed`);
      }

      let userId: string;
      try {
        userId = await authService.findOrCreateUser(githubUser, accessToken);
      } catch (dbError) {
        return res.redirect(`${FRONTEND_URL}/auth/error?error=database_error`);
      }

      let jwtToken: string;
      try {
        jwtToken = authService.generateToken({
          userId,
          githubId: githubUser.id.toString(),
          username: githubUser.login,
        });
      } catch (tokenGenError) {
        return res.redirect(`${FRONTEND_URL}/auth/error?error=token_generation_failed`);
      }

      res.redirect(`${FRONTEND_URL}/auth/success?token=${jwtToken}`);
    } catch (error) {
      res.redirect(`${FRONTEND_URL}/auth/error?error=unexpected_error`);
    }
  });
}

