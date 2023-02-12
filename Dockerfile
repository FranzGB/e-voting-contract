FROM node:16-alpine as base

WORKDIR /home/app

RUN npm install -g truffle ganache

FROM base as truffle

COPY package.json package-lock.json ./

RUN npm install --quiet

COPY truffle-config.js /home/app
COPY contracts /home/app/contracts
COPY migrations /home/app/migrations/
COPY test /home/app/test/

RUN truffle compile
RUN truffle migrate

FROM base as ganache-cli

EXPOSE 8545

CMD ["ganache-cli", "-p", "8545", "-i", "1"]

