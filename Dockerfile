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

# ---- Stage 2: production dependencies ----
# Dev dependencies (eslint, tsx, typescript, ...) are never installed here.
# The prisma CLI is a regular dependency so `prisma migrate deploy` works from the
# final image at the exact version pinned in package-lock.json.
FROM node:26-alpine AS prod-deps

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Generate the client against the prod node_modules so it lands in
# node_modules/.prisma and matches the runtime's engine/platform.
COPY prisma ./prisma
RUN npx prisma generate

# ---- Stage 3: runtime ----
FROM node:26-alpine AS runner

# Prisma's query/migration engines need openssl at runtime
RUN apk upgrade --no-cache && apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Nothing at runtime needs npm: the app starts via node and migrations run from
# the locked prisma CLI in node_modules. Removing it drops npm's bundled deps
# (undici, brace-expansion, http-cache-semantics, ...) from the image.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./next.config.mjs

USER nextjs
EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
