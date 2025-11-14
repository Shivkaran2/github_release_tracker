import express from 'express';
import { webhookService } from '../services/webhookService';

export function setupWebhookRoutes(app: express.Application): void {
  app.post('/webhook/github', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const event = req.headers['x-github-event'] as string;
      const payload = req.body.toString();

      if (!webhookService.verifySignature(payload, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const data = JSON.parse(payload);
      await webhookService.processWebhook(data, event);

      res.status(200).json({ received: true });
    } catch (error) {
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
}

