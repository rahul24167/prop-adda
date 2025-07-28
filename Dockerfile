# --- 1. Install dependencies ---
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

# --- 2. Build app ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Prisma client generation
RUN npx prisma generate

# ✅ Make sure next.config.js is present before build
COPY next.config.ts ./next.config.ts

# ⚠️ Build from the root, not /app/src — because .next is created at root
RUN npm run build:app

# --- 3. Production image ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080

# ✅ Copy everything from root `.next` (not inside /src!)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

# ✅ Start Next.js
CMD ["npx", "next", "start", "-p", "8080"]