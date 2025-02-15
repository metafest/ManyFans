FROM node:20.15.1-alpine AS base

WORKDIR /app

RUN npm install -g corepack@latest

WORKDIR /app
COPY . .

RUN corepack enable pnpm &&\
  echo "store-dir=./.store-dir" >> .npmrc &&\
  echo "strict-peer-dependencies=false" >> .npmrc &&\
  echo "shamefully-hoist=true" >> .npmrc &&\
  pnpm dlx turbo prune --scope="core" --docker


RUN corepack enable pnpm &&\
  pnpm install --frozen-lockfile &&\
  rm -f .npmrc

CMD ["pnpm", "dev"]
