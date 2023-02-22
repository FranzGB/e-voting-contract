FROM node:16-alpine AS builder

FROM builders AS truffle
# Install Truffle
RUN npm install -g truffle

# Move Contract Files
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY package*.json ./
# Install dependencies
RUN npm ci

COPY truffle-config.js ./truffle-config.js

# Compile Contracts
RUN truffle compile

# Run Tests
RUN truffle test


FROM builder AS webpack
# Copy frontend files
COPY frontend ./frontend

# Copy compiled contracts
COPY build/contracts ./frontend/public/contracts

# Install dependencies
WORKDIR /frontend
RUN npm ci


