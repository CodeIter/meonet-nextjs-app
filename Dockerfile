# syntax=docker.io/docker/dockerfile:1

############################################################################

# Base stage with minimal dependencies
FROM node:20-alpine AS base

############################################################################

# Install dependencies only when needed
FROM base AS deps

# Check
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install configured package manager from package.json
RUN corepack enable && \
    corepack prepare --activate

# Install node_modules dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i --frozen-lockfile

############################################################################

# Rebuild the source code only when needed
FROM base AS builder

# Set working directory
WORKDIR /app

# Copy node_modules dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of app files
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
#ENV NEXT_TELEMETRY_DISABLED=1

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install configured package manager from package.json
RUN corepack enable && \
    corepack prepare --activate

# Build project
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm run build

############################################################################

# Production image, copy all the files and run next
FROM base AS runner

# Set working directory
WORKDIR /app

# Add system user and group for app
RUN addgroup --system --gid 1001 nodejs \
    &&  adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

#===========================================================================

USER nextjs

# Uncomment the following line in case you want to disable telemetry during
# runtime.
#ENV NEXT_TELEMETRY_DISABLED=1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST="0.0.0.0"
ENV HOSTNAME="0.0.0.0"

# Expose default port
EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENTRYPOINT ["node", "server.js"]
CMD []

