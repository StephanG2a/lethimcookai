
ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim

WORKDIR /app

COPY --link package.json package.json
COPY --link package-lock.json package-lock.json
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY --link . .

RUN npx prisma generate

EXPOSE 3000 8080

CMD ["npm", "run", "dev-all"]
