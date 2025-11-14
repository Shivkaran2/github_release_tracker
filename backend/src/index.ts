import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { repositoryService } from './services/repositoryService';
import { DEFAULT_USER_ID } from './constants';
import { createContext } from './context';
import { USE_MOCK_SERVER } from './config';
import { setupAuthRoutes } from './routes/authRoutes';
import { setupWebhookRoutes } from './routes/webhookRoutes';

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors({ origin: true, credentials: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.text({ type: 'application/json' }));

  setupAuthRoutes(app);
  setupWebhookRoutes(app);

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => createContext(req),
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  const syncIntervalMs = Number(process.env.SYNC_INTERVAL_MS ?? 600_000);

  app.listen(port);

  if (!USE_MOCK_SERVER && Number.isFinite(syncIntervalMs) && syncIntervalMs > 0) {
    setInterval(() => {
      repositoryService.refreshAllRepositories(DEFAULT_USER_ID).catch(() => {});
    }, syncIntervalMs).unref?.();
  }
}

startServer().catch(() => {
  process.exit(1);
});
