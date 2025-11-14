import type { RepositoryService } from './services/repositoryService';
import { authService } from './services/authService';
import { DEFAULT_USER_ID } from './constants';
import { USE_MOCK_SERVER } from './config';

export type GraphQLContext = {
  userId: string;
  repositoryService: RepositoryService;
  isAuthenticated: boolean;
};

export async function createContext(req: {
  headers: { authorization?: string };
}): Promise<GraphQLContext> {
  let userId = DEFAULT_USER_ID;
  let isAuthenticated = false;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const tokenUserId = await authService.getUserFromToken(token);
    if (tokenUserId) {
      userId = tokenUserId;
      isAuthenticated = true;
    }
  }

  const service = USE_MOCK_SERVER
    ? await import('./services/mockService').then((m) => m.mockService)
    : await import('./services/repositoryService').then((m) => m.repositoryService);

  return {
    userId,
    repositoryService: service as unknown as RepositoryService,
    isAuthenticated,
  };
}




