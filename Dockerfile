FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY ./build ./build
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "start"]