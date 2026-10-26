# ---- Stage 1: build ----
# Full dependency set (incl. dev) to generate the Prisma client and build Next.js.
FROM node:26-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# Dependencies first so this layer is cached until the lockfile changes
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Everything else (see .dockerignore)
COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Stage 2: runtime ----
# next.config.mjs sets output: 'standalone', so .next/standalone already contains
# the server and only the node_modules it needs (including the Prisma client and
# query engine). No separate node_modules copy, so dev dependencies never ship.
FROM node:26-alpine AS runner

# Prisma's query engine needs openssl at runtime
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
