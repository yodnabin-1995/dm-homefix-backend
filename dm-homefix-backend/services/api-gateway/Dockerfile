# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json nest-cli.json tsconfig*.json ./
COPY libs ./libs
COPY services/api-gateway ./services/api-gateway

RUN npm ci
RUN npx nest build api-gateway

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist/services/api-gateway ./dist/services/api-gateway

EXPOSE 3000
CMD ["node", "dist/services/api-gateway/main"]
