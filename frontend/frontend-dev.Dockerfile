FROM node:17.4.0-alpine 
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./

CMD ["npm", "start"]
