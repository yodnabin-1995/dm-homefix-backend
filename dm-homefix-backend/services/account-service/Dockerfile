# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json nest-cli.json tsconfig*.json ./
COPY libs ./libs
COPY services/account-service ./services/account-service

# Install ALL deps (devDeps needed for nest build + prisma generate)
RUN npm ci

# Generate Prisma client for this service
RUN cd services/account-service && npx prisma generate --schema=./prisma/schema.prisma

# Compile TypeScript
RUN npx nest build account-service

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# OpenSSL required by Prisma query engine on Alpine
RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist/services/account-service ./dist/services/account-service
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/services/account-service/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/services/account-service/main"]