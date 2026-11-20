# syntax=docker.io/docker/dockerfile:1

############################################################################

# Base stage with minimal dependencies
FROM node:22-alpine3.22 AS base

############################################################################

# Install dependencies only when needed
FROM base AS deps

# Check
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_CONFIG_STORE_DIR="/pnpm/store"

# Enable corepack and install the package manager declared in package.json
COPY package.json ./
RUN corepack enable && \
    corepack prepare --activate

# Copy lockfile and pnpm config (pnpm-workspace.yaml holds pnpm settings)
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

# Install node_modules dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i --frozen-lockfile

############################################################################

# Rebuild the source code only when needed
FROM base AS builder

# Set working directory
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Uncomment to disable Next.js telemetry during build.
#ENV NEXT_TELEMETRY_DISABLED=1

# Copy node_modules dependencies, then the rest of the app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable && \
    corepack prepare --activate && \
    mkdir -p /app/public

# Build project (runs postbuild too; serwist writes public/sw.js here)
RUN pnpm run build

############################################################################

# Production image
FROM base AS runner

# Set working directory
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 1) Standalone server (traced output)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 2) Static assets and public files (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

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

# Run the web server
ENTRYPOINT ["node", "server.js"]
CMD []

