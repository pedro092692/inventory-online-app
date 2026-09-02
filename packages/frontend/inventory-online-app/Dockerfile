########################################
# Nexastock frontend (Next.js) — production image
########################################
# Multi-stage build: install deps once, build with them, then copy ONLY the standalone
# output (see next.config.ts's output:'standalone') into a clean final image — this keeps
# the image that actually ships small instead of dragging the full node_modules + build
# cache along.

# ---- deps: install once, reused by the build stage ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---- builder: run `next build` ----
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js inlines NEXT_PUBLIC_* variables into the client JS bundle AT BUILD TIME — setting
# them only as a runtime Fly secret is NOT enough, `next build` needs them present here.
# They are not secrets (they end up in the browser bundle either way), so they're passed as
# plain --build-arg / fly.toml [build.args] values — see DEPLOY.md.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_DASHBOARD
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_STORE_CREDIT_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_DASHBOARD=$NEXT_PUBLIC_DASHBOARD
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_STORE_CREDIT_ID=$NEXT_PUBLIC_STORE_CREDIT_ID

RUN npm run build

# ---- runner: minimal final image ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
# .next/standalone already contains a minimal server.js + only the node_modules it needs.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Fly.io provides PORT at runtime; Next's standalone server.js reads it automatically.
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
