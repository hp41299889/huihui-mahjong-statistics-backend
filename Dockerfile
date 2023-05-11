FROM node:18-alpine
WORKDIR /app
COPY ./build ./build
COPY package.json ./
COPY yarn.lock ./
RUN [ "yarn", "install", "--production=true"]
EXPOSE 8000