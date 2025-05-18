FROM node:18

USER root

WORKDIR /app

COPY ./src/package*.json ./
RUN npm install

RUN mkdir -p /app/storage/app/attachments && chmod -R a+rX /app/storage

COPY ./src ./

RUN npm run build
