# Multi-stage build for Next.js with SQLite3
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ sqlite
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Build argument to control database inclusion
ARG INCLUDE_DATABASE=false

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Build argument to control database inclusion (passed from builder)
ARG INCLUDE_DATABASE=false

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install runtime dependencies for SQLite3
RUN apk add --no-cache sqlite

# Copy necessary files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create directory for SQLite database
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Conditionally copy pre-built database if it exists
# The database is downloaded by GitHub Actions before Docker build
RUN --mount=type=bind,from=builder,source=/app,target=/tmp/builder \
    if [ -f /tmp/builder/awesome.db ]; then \
      echo "Copying database files..."; \
      cp /tmp/builder/awesome.db* /app/ 2>/dev/null || true; \
      chown nextjs:nodejs /app/awesome.db* 2>/dev/null || true; \
    else \
      echo "No database found, will be mounted at runtime or built on first run"; \
    fi && \
    if [ -f /tmp/builder/db-metadata.json ]; then \
      cp /tmp/builder/db-metadata.json /app/; \
      chown nextjs:nodejs /app/db-metadata.json; \
    fi

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Server startup
CMD ["node", "server.js"]
