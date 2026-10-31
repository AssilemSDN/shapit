FROM node:24-bookworm-slim AS node

FROM ghcr.io/charmbracelet/vhs:v0.11.0

USER root

COPY --from=node /usr/local /usr/local

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        make \
    && rm -rf /var/lib/apt/lists/*

RUN npm install --global corepack@0.35.0 \
    && corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

COPY . .

RUN yarn build

RUN printf '%s\n' \
        '#!/bin/bash' \
        'exec node /app/bin/shapit.js "$@"' \
        > /usr/local/bin/shapit \
    && chmod +x /usr/local/bin/shapit \
    && shapit --version

WORKDIR /app
