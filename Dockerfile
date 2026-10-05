# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./
COPY client/package.json client/
COPY server/package.json server/

FROM base AS build
RUN yarn install --frozen-lockfile --non-interactive
COPY client client
COPY server server
RUN yarn workspace presight-client build && yarn workspace presight-server build

FROM base AS runtime
ENV NODE_ENV=production \
    PORT=4000 \
    DB_PATH=/data/presight.db \
    CLIENT_DIST=/app/client/dist
RUN yarn install --frozen-lockfile --non-interactive --production --ignore-scripts \
    && yarn cache clean \
    && mkdir -p /data \
    && chown node:node /data
COPY --from=build /app/server/dist server/dist
COPY --from=build /app/client/dist client/dist
USER node
EXPOSE 4000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:4000/api/health || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "server/dist/index.js"]
