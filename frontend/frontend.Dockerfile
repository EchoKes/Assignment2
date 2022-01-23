FROM node:latest

WORKDIR /app

COPY package.json ./

RUN npm install

# EXPOSE 8180

COPY . ./

CMD ["npm", "start"]
