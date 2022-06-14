FROM node:18.3-buster-slim

# Must be before WORKDIR, else `RUN npm ci` fails due to permission errors accessing
# working directory
USER node

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm ci

ENV PATH ./node_modules/.bin/:$PATH
