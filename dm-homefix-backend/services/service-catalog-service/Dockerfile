# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json nest-cli.json tsconfig*.json ./
COPY libs ./libs
COPY services/service-catalog-service ./services/service-catalog-service
COPY node_modules ./node_modules

RUN cd services/service-catalog-service && npx prisma generate --schema=./prisma/schema.prisma

RUN npx nest build service-catalog-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL 1.1 required by Prisma query engine on Alpine
RUN apk add --no-cache openssl openssl-dev libc6-compat

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/services/service-catalog-service ./dist/services/service-catalog-service
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/services/service-catalog-service/prisma ./prisma

EXPOSE 3003
CMD ["node", "dist/services/service-catalog-service/main"]