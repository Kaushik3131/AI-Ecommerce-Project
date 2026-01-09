import { StandardCheckoutClient, Env } from "pg-sdk-node";

/**
 * PhonePe Client Wrapper
 * Provides a singleton instance of PhonePe StandardCheckoutClient
 * with environment-based configuration
 */

// Validate environment variables
if (!process.env.PHONEPE_CLIENT_ID) {
  throw new Error("PHONEPE_CLIENT_ID is not defined");
}

if (!process.env.PHONEPE_CLIENT_SECRET) {
  throw new Error("PHONEPE_CLIENT_SECRET is not defined");
}

if (!process.env.PHONEPE_CLIENT_VERSION) {
  throw new Error("PHONEPE_CLIENT_VERSION is not defined");
}

// Configuration
const clientId = process.env.PHONEPE_CLIENT_ID;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION, 10);
const environment =
  process.env.PHONEPE_MODE === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;

// Singleton instance
let phonePeClient: StandardCheckoutClient | null = null;

/**
 * Get PhonePe client instance (Singleton)
 * @returns StandardCheckoutClient instance
 */
export function getPhonePeClient(): StandardCheckoutClient {
  if (!phonePeClient) {
    phonePeClient = StandardCheckoutClient.getInstance(
      clientId,
      clientSecret,
      clientVersion,
      environment,
    );
  }
  return phonePeClient;
}

/**
 * Verify webhook signature
 * @param authHeader - Authorization header from webhook
 * @param username - Configured webhook username
 * @param password - Configured webhook password
 * @returns boolean - true if signature is valid
 */
export function verifyWebhookSignature(
  authHeader: string,
  username: string,
  password: string,
): boolean {
  const crypto = require("crypto");
  const expectedHash = crypto
    .createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");

  return authHeader === expectedHash;
}
