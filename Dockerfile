FROM node:16-alpine as base

WORKDIR /home/app

RUN npm install -g truffle ganache

FROM base as truffle

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run test


