# The preview site as a small Node server. Put your own reverse proxy in front
# of it; the container only speaks plain HTTP on port 3000.

# ---- build -------------------------------------------------------------------
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build:site

# ---- runtime dependencies ------------------------------------------------------
# adapter-node bundles devDependencies into the build; only `dependencies` are
# needed next to it.
FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# ---- run -----------------------------------------------------------------------
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=3000 \
	ORIGIN=https://cock.joshicodes.de

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
	CMD wget -qO- http://127.0.0.1:3000/robots.txt > /dev/null || exit 1

CMD ["node", "build"]
