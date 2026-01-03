FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies config items
RUN pnpm config set store-dir /root/.local/share/pnpm/store
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the project
# Next.js requires NEXT_PUBLIC_ variables at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION
ARG NEXT_PUBLIC_SANITY_API_TOKEN
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SANITY_API_TOKEN=$NEXT_PUBLIC_SANITY_API_TOKEN
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Server-side env vars needed during build (for API route analysis)
# Use placeholder values - real values will be set at runtime
ENV CLERK_SECRET_KEY="build-placeholder"
ENV SANITY_API_TOKEN="build-placeholder"
ENV GOOGLE_GENERATIVE_AI_API_KEY="build-placeholder"
ENV PHONEPE_CLIENT_ID="build-placeholder"
ENV PHONEPE_CLIENT_SECRET="build-placeholder"
ENV PHONEPE_CLIENT_VERSION="1"
ENV PHONEPE_MERCHANT_ID="build-placeholder"
ENV PHONEPE_MODE="TEST"
ENV PHONEPE_WEBHOOK_USERNAME="build-placeholder"
ENV PHONEPE_WEBHOOK_PASSWORD="build-placeholder"

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Sanity types (optional, can be done in CI/CD)
# RUN pnpm run typegen

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
