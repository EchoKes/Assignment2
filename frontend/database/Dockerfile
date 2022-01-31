# start json-server
FROM node:17.4.0-alpine
WORKDIR /server
RUN npm install -g json-server
COPY db.json ./
ENTRYPOINT [ "json-server", "--port", "8185" ]

CMD ["/server/db.json"]
