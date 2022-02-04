FROM node:17.4.0-alpine 
ARG JSON_SERVER_VERSION=v0.15.1
ARG PORT_NO=8185
WORKDIR /app
COPY db.json .
RUN npm install -g json-server@$JSON_SERVER_VERSION

EXPOSE ${PORT_NO}

CMD [ "json-server", "-H", "0.0.0.0", "db.json", "-p${PORT_NO}" ]
