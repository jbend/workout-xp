FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json apps/web/
COPY packages/program-data/package.json packages/program-data/
COPY packages/program-schema/package.json packages/program-schema/
RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
RUN pnpm --filter @workout-xp/web build

FROM builder AS deploy
RUN pnpm deploy --filter=@workout-xp/web --prod --legacy /prod

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=deploy /prod .
EXPOSE 3000
CMD ["node", "build"]
