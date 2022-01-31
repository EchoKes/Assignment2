FROM node:17.4.0-alpine as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

RUN npm run build

FROM node:17.4.0-alpine
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 8180:3000

CMD ["serve", "-s", "build"]


