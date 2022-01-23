FROM node:latest

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

EXPOSE 8180

COPY . .

CMD ["npm", "start"]
