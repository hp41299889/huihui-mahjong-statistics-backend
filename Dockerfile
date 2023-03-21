# 依赖构建阶段
FROM node:18-alpine as dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci

# 源代码复制和构建阶段
FROM node:18-alpine as build-stage

WORKDIR /app

COPY --from=dependencies /app/node_modules /app/node_modules
COPY . .

# 仅在需要构建步骤时启用
RUN npm run build

# 生产阶段
FROM node:18-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app .

# 您的应用程序使用的端口
EXPOSE 8000

CMD ["node", "build/", "index.js"]