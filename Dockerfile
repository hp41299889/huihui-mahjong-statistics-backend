FROM node:16.16.0
WORKDIR /app
COPY /build ./build
COPY package.json .
COPY .env .
RUN npm install
CMD npm run start