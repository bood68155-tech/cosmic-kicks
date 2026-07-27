// ===========================================================================
// lib/stripe/server.ts
// Stripe server-side client initialization.
// ===========================================================================

import Stripe from 'stripe';

/**
 * Creates a Stripe instance using the secret key from environment variables.
 * The secret key starts with 'sk_live_' (production) or 'sk_test_' (test mode).
 */
export function createStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set in environment variables. ' +
      'Get it from https://dashboard.stripe.com/apikeys'
    );
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia', // latest stable API version
    typescript: true,
  });
}

/**
 * Returns Stripe webhook secret for signature verification.
 */
export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      'STRIPE_WEBHOOK_SECRET is not set in environment variables. ' +
      'Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe ' +
      'or get it from https://dashboard.stripe.com/webhooks'
    );
  }

  return secret;
}
