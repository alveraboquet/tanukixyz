FROM node:16

WORKDIR /tanuki

COPY . .

RUN yarn && yarn build
